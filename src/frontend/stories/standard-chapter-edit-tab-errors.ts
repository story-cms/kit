export type StandardChapterEditTab = 'details' | 'blocks' | 'resources';

const STANDARD_CHAPTER_EDIT_TAB_ORDER: StandardChapterEditTab[] = [
  'details',
  'blocks',
  'resources',
];

const STANDARD_CHAPTER_EDIT_TAB_LABELS: Record<StandardChapterEditTab, string> = {
  details: 'Details',
  blocks: 'Blocks',
  resources: 'Resources',
};

function matchesErrorPrefix(key: string, prefix: string): boolean {
  return key === prefix || key.startsWith(`${prefix}.`);
}

function errorKeyBelongsToTab(key: string, tab: StandardChapterEditTab): boolean {
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

export function standardChapterEditTabHasError(
  tab: StandardChapterEditTab,
  errors: Record<string, string | string[]>,
): boolean {
  return Object.keys(errors).some((key) => errorKeyBelongsToTab(key, tab));
}

export function firstStandardChapterEditTabWithError(
  errors: Record<string, string | string[]>,
): string | null {
  for (const tab of STANDARD_CHAPTER_EDIT_TAB_ORDER) {
    if (!standardChapterEditTabHasError(tab, errors)) continue;
    return STANDARD_CHAPTER_EDIT_TAB_LABELS[tab];
  }

  return null;
}
