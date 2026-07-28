import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const frontendRoot = join(root, 'src/frontend');
const palettePath = join(frontendRoot, 'shared/colors.palette.ts');
const usagePath = join(frontendRoot, 'shared/colors.usage.ts');
const tailwindConfigPath = join(root, 'tailwind.config.js');
const indexCssPath = join(frontendRoot, 'index.css');

const EXCLUDED_FILES = new Set([
  'shared/colors.story.vue',
  'shared/colors.usage.ts',
  'shared/colors.palette.ts',
]);

const SOURCE_EXTENSIONS = new Set(['.vue', '.css', '.ts', '.js']);

const SKIP_THEME_KEYS = new Set([
  'transparent',
  'current',
  'gray',
  'slate',
  'blue',
  'yellow',
  'indigo',
  'red',
  'green',
]);

const SCALE_FAMILIES = ['gray', 'slate', 'blue', 'green', 'red', 'yellow', 'indigo'];

const EXTENDED_SCALE_FAMILIES = [
  ...SCALE_FAMILIES,
  'amber',
  'emerald',
  'orange',
  'teal',
  'violet',
  'purple',
  'pink',
  'cyan',
  'sky',
  'rose',
  'fuchsia',
  'lime',
];

const VARIANT_PREFIX = '(?:hover:|focus:|active:|disabled:|checked:|indeterminate:)?';

const CLASS_COLOR_PATTERN = new RegExp(
  `${VARIANT_PREFIX}(?:bg|text|border|from|to|via|divide|placeholder)-([a-zA-Z][a-zA-Z0-9_-]*(?:-[0-9]+)?)(?:\\/[0-9]+)?\\b`,
  'g',
);

const RING_STROKE_FILL_PATTERN = new RegExp(
  `${VARIANT_PREFIX}(?:ring|stroke|fill)-(${EXTENDED_SCALE_FAMILIES.join('|')}|accent(?:-[a-z0-9]+)?|studio(?:-[a-z0-9]+)+|error(?:-[a-z0-9]+)?|black|white)(?:\\/[0-9]+)?\\b`,
  'g',
);

function walkDirectory(directory) {
  const files = [];

  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...walkDirectory(fullPath));
      continue;
    }

    const extension = entry.slice(entry.lastIndexOf('.'));
    if (!SOURCE_EXTENSIONS.has(extension)) continue;

    const relativePath = relative(frontendRoot, fullPath);
    if (EXCLUDED_FILES.has(relativePath)) continue;

    files.push({ fullPath, relativePath });
  }

  return files;
}

function normalizeToken(rawToken) {
  return rawToken.replace(/\/[0-9]+$/, '');
}

function isScaleShade(token) {
  return EXTENDED_SCALE_FAMILIES.some((family) => {
    if (!token.startsWith(`${family}-`)) return false;
    return /^[0-9]+$/.test(token.slice(family.length + 1));
  });
}

function isThemeGroupToken(token) {
  return (
    token === 'accent' ||
    token.startsWith('accent-') ||
    token === 'studio' ||
    token.startsWith('studio-') ||
    token === 'error' ||
    token.startsWith('error-')
  );
}

function isKnownColorToken(token, themeTokens, cssVariables) {
  if (cssVariables.has(token)) return true;
  if (themeTokens.has(token)) return true;
  if (isScaleShade(token)) return true;
  if (isThemeGroupToken(token)) return true;
  if (['black', 'white', 'transparent', 'current'].includes(token)) return true;
  return false;
}

function extractRingStrokeFillToken(match) {
  const value = match[1];
  const scaleMatch = value.match(/^([a-z_]+)-(\d+)$/);
  if (scaleMatch) return `${scaleMatch[1]}-${scaleMatch[2]}`;
  return value;
}

function parseCssVariables() {
  const source = readFileSync(indexCssPath, 'utf8');
  const variables = new Map();

  for (const match of source.matchAll(/(--[a-z-]+)\s*:\s*(#[0-9a-fA-F]{3,8})/g)) {
    variables.set(match[1], match[2].toUpperCase());
  }

  return variables;
}

function parseNestedColorBlocks(block, tokens) {
  for (const nestedMatch of block.matchAll(/^\s*([a-z_]+):\s*\{([\s\S]*?)\n\s*\},?/gm)) {
    const groupName = nestedMatch[1];
    const nestedBlock = nestedMatch[2];

    for (const match of nestedBlock.matchAll(
      /^\s*(DEFAULT|"[a-z0-9-]+"|[a-z0-9-]+)\s*:\s*['"](#[0-9A-Fa-f]{3,8})['"]/gm,
    )) {
      const rawKey = match[1];
      const hex = match[2].toUpperCase();
      const key = rawKey === 'DEFAULT' ? null : rawKey.replace(/"/g, '');
      const tokenName = key === null ? groupName : `${groupName}-${key}`;
      tokens.set(tokenName, hex);
    }
  }
}

function stripNestedColorBlocks(block) {
  return block.replace(/^\s*[a-z_]+:\s*\{[\s\S]*?\n\s*\},?/gm, '');
}

function parseThemeTokens() {
  const source = readFileSync(tailwindConfigPath, 'utf8');
  const tokens = new Map();

  const colorsBlock = source.match(/colors:\s*\{([\s\S]*?)\n\s*\},?\n\s*\},/);
  if (!colorsBlock) return tokens;

  const block = colorsBlock[1];

  parseNestedColorBlocks(block, tokens);

  const flatBlock = stripNestedColorBlocks(block);

  for (const match of flatBlock.matchAll(/^\s*([a-z_]+):\s*'(#[0-9A-Fa-f]{3,8})'/gm)) {
    if (!SKIP_THEME_KEYS.has(match[1])) {
      tokens.set(match[1], match[2].toUpperCase());
    }
  }

  if (/white:\s*colors\.white/.test(block)) {
    tokens.set('white', '#FFFFFF');
  }

  return tokens;
}

function discoverUsedTokens(files, themeTokens, cssVariables) {
  const used = new Set();

  for (const { fullPath } of files) {
    const content = readFileSync(fullPath, 'utf8');

    for (const match of content.matchAll(CLASS_COLOR_PATTERN)) {
      const token = normalizeToken(match[1]);
      if (isKnownColorToken(token, themeTokens, cssVariables)) {
        used.add(token);
      }
    }

    for (const match of content.matchAll(RING_STROKE_FILL_PATTERN)) {
      const token = normalizeToken(extractRingStrokeFillToken(match));
      if (isKnownColorToken(token, themeTokens, cssVariables)) {
        used.add(token);
      }
    }

    for (const match of content.matchAll(/var\((--[a-z-]+)\)/g)) {
      used.add(match[1]);
    }
  }

  return used;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildPattern(name) {
  if (name.startsWith('--')) {
    const escaped = escapeRegExp(name);
    return new RegExp(`(?:var\\(${escaped}\\)|${escaped})`, 'g');
  }

  const escaped = escapeRegExp(name);

  if (name === 'accent' || name === 'studio' || name === 'error') {
    return new RegExp(`-${escaped}(?!-)(?:/[0-9]+)?(?=[\\s"'\\],]|$)`, 'g');
  }

  return new RegExp(`-${escaped}(?:/[0-9]+)?`, 'g');
}

function countMatches(content, pattern) {
  const matches = content.match(pattern);
  return matches ? matches.length : 0;
}

function generateUsageMap(colorNames, files) {
  const usage = Object.fromEntries(
    colorNames.map((name) => [name, { count: 0, files: new Set() }]),
  );

  for (const { fullPath, relativePath } of files) {
    const content = readFileSync(fullPath, 'utf8');

    for (const name of colorNames) {
      const pattern = buildPattern(name);
      const matches = countMatches(content, pattern);

      if (matches === 0) continue;

      usage[name].count += matches;
      usage[name].files.add(relativePath);
    }
  }

  return Object.fromEntries(
    colorNames.map((name) => [
      name,
      {
        count: usage[name].count,
        files: [...usage[name].files].sort(),
      },
    ]),
  );
}

function buildPaletteTokens(themeTokens, cssVariables, usedTokens) {
  const palette = new Set([...themeTokens.keys(), ...cssVariables.keys(), ...usedTokens]);
  return [...palette].sort();
}

function sectionForToken(name) {
  if (name.startsWith('--')) return 'CSS Variables';
  if (name === 'studio' || name.startsWith('studio-')) return 'Studio';
  if (name === 'accent' || name.startsWith('accent-')) return 'Accent';
  if (name === 'error' || name.startsWith('error-')) return 'Error';
  if (isScaleShade(name)) {
    const family = EXTENDED_SCALE_FAMILIES.find((scale) => name.startsWith(`${scale}-`));
    return family.charAt(0).toUpperCase() + family.slice(1);
  }
  return 'Brand';
}

function buildSwatch(name, themeTokens, cssVariables) {
  if (name.startsWith('--')) {
    return {
      name,
      style: `background: var(${name})`,
      hex: cssVariables.get(name),
    };
  }

  const hex = themeTokens.get(name);

  return {
    name,
    class: `bg-${name}`,
    ...(hex ? { hex } : {}),
  };
}

function buildSections(tokenNames, themeTokens, cssVariables) {
  const sections = new Map();

  for (const name of tokenNames) {
    const title = sectionForToken(name);
    if (!sections.has(title)) sections.set(title, []);
    sections.get(title).push(buildSwatch(name, themeTokens, cssVariables));
  }

  const sectionOrder = [
    'Brand',
    'Accent',
    'Studio',
    'Error',
    'CSS Variables',
    'Gray',
    'Slate',
    'Blue',
    'Green',
    'Red',
    'Yellow',
    'Indigo',
    'Amber',
    'Emerald',
    'Orange',
    'Teal',
    'Violet',
    'Purple',
    'Pink',
    'Cyan',
    'Sky',
    'Rose',
    'Fuchsia',
    'Lime',
  ];

  return sectionOrder
    .filter((title) => sections.has(title))
    .map((title) => ({
      title,
      colors: sections.get(title).sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

function serializeValue(value) {
  if (value === undefined) return undefined;
  return `'${value.replace(/'/g, "\\'")}'`;
}

function formatSwatch(swatch) {
  const parts = [`name: ${serializeValue(swatch.name)}`];
  if (swatch.class) parts.push(`class: ${serializeValue(swatch.class)}`);
  if (swatch.style) parts.push(`style: ${serializeValue(swatch.style)}`);
  if (swatch.hex) parts.push(`hex: ${serializeValue(swatch.hex)}`);
  return `{ ${parts.join(', ')} }`;
}

function formatPaletteFile(sections) {
  const sectionBlocks = sections
    .map((section) => {
      const colors = section.colors.map((color) => `      ${formatSwatch(color)},`).join('\n');
      return `  {
    title: '${section.title}',
    colors: [
${colors}
    ],
  },`;
    })
    .join('\n');

  return `// Generated by scripts/generate-color-usage.mjs — do not edit
// Re-run: npm run colors:usage
export type ColorSwatch = {
  name: string;
  class?: string;
  style?: string;
  hex?: string;
};

export type ColorSection = {
  title: string;
  colors: ColorSwatch[];
};

export const colorSections: ColorSection[] = [
${sectionBlocks}
];
`;
}

function formatUsageFile(usage) {
  const entries = Object.entries(usage)
    .map(([name, { count, files }]) => {
      const fileLines = files.map((file) => `      '${file}',`).join('\n');
      const filesBlock = files.length ? `files: [\n${fileLines}\n    ]` : 'files: []';
      return `  '${name}': { count: ${count}, ${filesBlock} },`;
    })
    .join('\n');

  return `// Generated by scripts/generate-color-usage.mjs — do not edit
// Re-run: npm run colors:usage
export type ColorUsage = { count: number; files: string[] };

export const colorUsage: Record<string, ColorUsage> = {
${entries}
};
`;
}

const files = walkDirectory(frontendRoot);
const themeTokens = parseThemeTokens();
const cssVariables = parseCssVariables();
const usedTokens = discoverUsedTokens(files, themeTokens, cssVariables);
const paletteTokens = buildPaletteTokens(themeTokens, cssVariables, usedTokens);
const sections = buildSections(paletteTokens, themeTokens, cssVariables);
const usage = generateUsageMap(paletteTokens, files);

writeFileSync(palettePath, formatPaletteFile(sections));
writeFileSync(usagePath, formatUsageFile(usage));

console.log(
  `Wrote ${relative(root, palettePath)} and ${relative(root, usagePath)} (${paletteTokens.length} colors, ${files.length} files scanned)`,
);
