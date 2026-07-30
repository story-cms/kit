import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { kebabCase } from 'change-case';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const defaultOutDir = join(root, 'docs', 'qa');

function parseArgs(argv) {
  const options = {
    base: 'main',
    port: 6006,
    out: null,
    host: 'http://localhost',
    format: 'github',
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--base') options.base = argv[++i];
    else if (arg === '--port') options.port = Number(argv[++i]);
    else if (arg === '--out') options.out = argv[++i];
    else if (arg === '--host') options.host = argv[++i].replace(/\/$/, '');
    else if (arg === '--format') {
      const value = argv[++i];
      options.format = value === 'historie' ? 'histoire' : value;
    }
  }

  return options;
}

function git(command) {
  return execSync(command, { cwd: root, encoding: 'utf8' }).trim();
}

function storyLink(storyPath, options, outPath) {
  if (options.format === 'histoire') {
    const rel = relative(dirname(outPath), join(root, storyPath)).replace(/\\/g, '/');
    return rel.startsWith('.') ? rel : `./${rel}`;
  }

  const id = kebabCase(storyPath.toLowerCase());
  return `${options.host}:${options.port}/story/${id}`;
}

function siblingStoryPath(vuePath) {
  if (vuePath.endsWith('.story.vue')) return vuePath;
  const slash = vuePath.lastIndexOf('/');
  const dir = vuePath.substring(0, slash);
  const base = vuePath.substring(slash + 1).replace(/\.vue$/, '');
  return `${dir}/${base}.story.vue`;
}

function componentFileName(storyPath) {
  return storyPath.replace(/\.story\.vue$/, '.vue').split('/').pop();
}

function parseStoryMeta(storyPath) {
  const content = readFileSync(storyPath, 'utf8');
  const title = content.match(/<Story[^>]*\stitle="([^"]+)"/)?.[1] ?? storyPath;
  const group = content.match(/<Story[^>]*\sgroup="([^"]+)"/)?.[1] ?? '';
  return { title, group };
}

function collectChangedVueFiles(mergeBase) {
  return git(`git diff --name-only ${mergeBase}..HEAD -- '*.vue'`)
    .split('\n')
    .filter(Boolean);
}

function collectStories(changedVueFiles) {
  const stories = new Map();

  for (const file of changedVueFiles) {
    const storyPath = siblingStoryPath(file);
    if (!existsSync(storyPath)) continue;
    if (stories.has(storyPath)) continue;

    const { title, group } = parseStoryMeta(storyPath);
    stories.set(storyPath, { title, group, sourceFiles: [file] });
  }

  for (const file of changedVueFiles) {
    if (file.endsWith('.story.vue') && existsSync(file) && !stories.has(file)) {
      const { title, group } = parseStoryMeta(file);
      stories.set(file, { title, group, sourceFiles: [file] });
    }
  }

  return stories;
}

function collectUnchangedStories(changedVueFiles, changedStories) {
  const changed = new Set(changedVueFiles);
  const changedStoryPaths = new Set(changedStories.keys());
  const dirs = [...new Set(changedVueFiles.map((f) => f.replace(/\/[^/]+$/, '')))];
  const stories = new Map();

  for (const dir of dirs.sort()) {
    const files = git(`git ls-files '${dir}/*.vue'`).split('\n').filter(Boolean);
    for (const file of files) {
      if (changed.has(file)) continue;
      if (file.endsWith('.story.vue')) continue;

      const storyPath = siblingStoryPath(file);
      if (!existsSync(storyPath)) continue;
      if (changedStoryPaths.has(storyPath)) continue;
      if (stories.has(storyPath)) continue;

      const { title, group } = parseStoryMeta(storyPath);
      stories.set(storyPath, { title, group, sourceFile: file });
    }
  }

  return stories;
}

function collectNoStoryFiles(changedVueFiles, stories) {
  const covered = new Set();
  for (const storyPath of stories.keys()) {
    covered.add(storyPath);
    covered.add(storyPath.replace(/\.story\.vue$/, '.vue'));
  }

  return changedVueFiles.filter((file) => {
    if (file.endsWith('.story.vue')) return false;
    if (covered.has(file)) return false;
    return !existsSync(siblingStoryPath(file));
  });
}

function appendStoryTable(lines, stories, options, outPath) {
  for (const [storyPath, meta] of [...stories.entries()].sort((a, b) =>
    a[1].title.localeCompare(b[1].title),
  )) {
    const url = storyLink(storyPath, options, outPath);
    lines.push(
      `| ${meta.title} | ${meta.group} | \`${componentFileName(storyPath)}\` | [${meta.title}](${url}) |`,
    );
  }
}

function parseTableCells(line) {
  return line.split('|').map((cell) => cell.trim());
}

function parsePreservedUnchangedRows(content) {
  const sectionMatch = content.match(
    /## Unchanged — regression check[\s\S]*?(?=\n## |\n*$)/,
  );
  if (!sectionMatch) return new Map();

  const preserved = new Map();

  for (const line of sectionMatch[0].split('\n')) {
    if (!line.startsWith('|') || line.includes('---')) continue;

    const cells = parseTableCells(line);
    if (cells.length < 8) continue;

    const checkedCell = cells[1];
    const componentCell = cells[4];
    const dqaCell = cells[6];

    const componentMatch = componentCell.match(/`([^`]+\.vue)`/);
    if (!componentMatch) continue;

    preserved.set(componentMatch[1], {
      checked: /\[x\]/i.test(checkedCell),
      dqaQuestions: dqaCell,
    });
  }

  return preserved;
}

function appendUnchangedStoryTable(lines, stories, options, outPath, preserved) {
  lines.push(
    '| Checked | Area | Group | Component | Open in Histoire | DQA questions |',
    '|---------|------|-------|-----------|------------------|---------------|',
  );

  for (const [storyPath, meta] of [...stories.entries()].sort((a, b) =>
    a[1].title.localeCompare(b[1].title),
  )) {
    const component = componentFileName(storyPath);
    const prev = preserved.get(component);
    const checked = prev?.checked ? '[x]' : '[ ]';
    const dqa = prev?.dqaQuestions ?? '';
    const url = storyLink(storyPath, options, outPath);
    lines.push(
      `| ${checked} | ${meta.title} | ${meta.group} | \`${component}\` | [${meta.title}](${url}) | ${dqa} |`,
    );
  }
}

function buildGithubMarkdown({
  branch,
  mergeBase,
  options,
  stories,
  unchangedStories,
  noStoryFiles,
  outPath,
  preserved,
}) {
  const baseUrl = `${options.host}:${options.port}`;
  const lines = [
    `# QA: ${branch}`,
    '',
    `**Base:** ${options.base} @ \`${mergeBase.slice(0, 7)}\`  `,
    `**Histoire (local):** \`npm run dev\` → ${baseUrl}  `,
    '**Histoire (preview):** After opening a PR, use the Cloudflare Pages deployment URL from the PR checks (project: `kit`). Replace the localhost base URL below.',
    '',
    '_Generated by `npm run changelog:qa`. Edit Summary, Checked, and DQA questions below; those persist across `npm run changelog:qa`._',
    '',
    '## Summary',
    '',
    '- _Describe the main themes of this branch for QA_',
    '',
    '## Visual checks — changed (Histoire)',
    '',
    '| Area | Group | Component | Open in Histoire |',
    '|------|-------|-----------|------------------|',
  ];

  appendStoryTable(lines, stories, options, outPath);

  lines.push(
    '',
    '## Unchanged — regression check',
    '',
    '_Unchanged `.vue` files with co-located stories in folders where something changed. Confirm these still look correct._',
    '',
  );

  appendUnchangedStoryTable(lines, unchangedStories, options, outPath, preserved);

  lines.push('', '## No dedicated story — test indirectly', '', '| Component | Notes |', '|-----------|-------|');

  if (noStoryFiles.length === 0) {
    lines.push('| _None_ | All changed `.vue` files have co-located stories or are covered above |');
  } else {
    for (const file of noStoryFiles.sort()) {
      lines.push(`| \`${file}\` | Find a parent page story or add a co-located \`.story.vue\` |`);
    }
  }

  lines.push('');

  return lines.join('\n');
}

function buildHistoireMarkdown({
  branch,
  mergeBase,
  options,
  stories,
  unchangedStories,
  noStoryFiles,
  outPath,
  preserved,
}) {
  const lines = [
    '---',
    `title: QA ${branch.split('-')[0] ?? branch}`,
    'group: top',
    'icon: carbon:checklist',
    '---',
    '',
    `# QA: ${branch}`,
    '',
    `**Base:** ${options.base} @ \`${mergeBase.slice(0, 7)}\`  `,
    '**Histoire:** `npm run dev` — open this page from the sidebar under the top group, or use relative links below.',
    '',
    '_Generated by `npm run changelog:qa -- --format histoire`. Edit Summary, Checked, and DQA questions below; those persist across `npm run changelog:qa`._',
    '',
    '## Summary',
    '',
    '- _Describe the main themes of this branch for QA_',
    '',
    '## Visual checks — changed (Histoire)',
    '',
    '| Area | Group | Component | Open in Histoire |',
    '|------|-------|-----------|------------------|',
  ];

  appendStoryTable(lines, stories, options, outPath);

  lines.push(
    '',
    '## Unchanged — regression check',
    '',
    '_Unchanged `.vue` files with co-located stories in folders where something changed. Confirm these still look correct._',
    '',
  );

  appendUnchangedStoryTable(lines, unchangedStories, options, outPath, preserved);

  lines.push('', '## No dedicated story — test indirectly', '', '| Component | Notes |', '|-----------|-------|');

  if (noStoryFiles.length === 0) {
    lines.push('| _None_ | All changed `.vue` files have co-located stories or are covered above |');
  } else {
    for (const file of noStoryFiles.sort()) {
      lines.push(`| \`${file}\` | Find a parent page story or add a co-located \`.story.vue\` |`);
    }
  }

  lines.push('');

  return lines.join('\n');
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const branch = git('git branch --show-current');
  const mergeBase = git(`git merge-base HEAD ${options.base}`);
  const changedVueFiles = collectChangedVueFiles(mergeBase);
  const stories = collectStories(changedVueFiles);
  const unchangedStories = collectUnchangedStories(changedVueFiles, stories);
  const noStoryFiles = collectNoStoryFiles(changedVueFiles, stories);

  const extension = options.format === 'histoire' ? '.story.md' : '.md';
  const outPath = options.out ?? join(defaultOutDir, `changelog-qa${extension}`);

  const preserved = existsSync(outPath)
    ? parsePreservedUnchangedRows(readFileSync(outPath, 'utf8'))
    : new Map();

  const build = options.format === 'histoire' ? buildHistoireMarkdown : buildGithubMarkdown;
  const markdown = build({
    branch,
    mergeBase,
    options,
    stories,
    unchangedStories,
    noStoryFiles,
    outPath,
    preserved,
  });

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, markdown);

  console.log(`Wrote ${outPath} (${options.format} format)`);
  console.log(`  ${stories.size} changed Histoire stories`);
  console.log(`  ${unchangedStories.size} unchanged Histoire stories`);
  console.log(`  ${noStoryFiles.length} changed files without stories`);
}

main();
