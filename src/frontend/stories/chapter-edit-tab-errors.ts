export type ChapterEditTab = 'details' | 'blocks' | 'resources';

const CHAPTER_EDIT_TAB_ORDER: ChapterEditTab[] = ['details', 'blocks', 'resources'];

const CHAPTER_EDIT_TAB_LABELS: Record<ChapterEditTab, string> = {
  details: 'Details',
  blocks: 'Blocks',
  resources: 'Resources',
};

function matchesErrorPrefix(key: string, prefix: string): boolean {
  return key === prefix || key.startsWith(`${prefix}.`);
}

function errorKeyBelongsToTab(key: string, tab: ChapterEditTab): boolean {
  if (tab === 'blocks') {
    return matchesErrorPrefix(key, 'bundle.blocks');
  }
  if (tab === 'resources') {
    return matchesErrorPrefix(key, 'bundle.resources');
  }
  return (
    key.startsWith('bundle.') &&
    !matchesErrorPrefix(key, 'bundle.blocks') &&
    !matchesErrorPrefix(key, 'bundle.resources')
  );
}

export function chapterEditTabHasError(
  tab: ChapterEditTab,
  errors: Record<string, string | string[]>,
): boolean {
  return Object.keys(errors).some((key) => errorKeyBelongsToTab(key, tab));
}

export function firstChapterEditTabWithError(
  errors: Record<string, string | string[]>,
): string | null {
  for (const tab of CHAPTER_EDIT_TAB_ORDER) {
    if (!chapterEditTabHasError(tab, errors)) continue;
    return CHAPTER_EDIT_TAB_LABELS[tab];
  }

  return null;
}
