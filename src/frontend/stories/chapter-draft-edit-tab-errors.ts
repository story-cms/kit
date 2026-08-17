export type ChapterDraftEditTab = 'details' | 'blocks' | 'resources';

const CHAPTER_DRAFT_EDIT_TAB_ORDER: ChapterDraftEditTab[] = [
  'details',
  'blocks',
  'resources',
];

const CHAPTER_DRAFT_EDIT_TAB_LABELS: Record<ChapterDraftEditTab, string> = {
  details: 'Details',
  blocks: 'Blocks',
  resources: 'Resources',
};

function matchesErrorPrefix(key: string, prefix: string): boolean {
  return key === prefix || key.startsWith(`${prefix}.`);
}

function errorKeyBelongsToTab(key: string, tab: ChapterDraftEditTab): boolean {
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

export function chapterDraftEditTabHasError(
  tab: ChapterDraftEditTab,
  errors: Record<string, string | string[]>,
): boolean {
  return Object.keys(errors).some((key) => errorKeyBelongsToTab(key, tab));
}

export function firstChapterDraftEditTabWithError(
  errors: Record<string, string | string[]>,
): string | null {
  for (const tab of CHAPTER_DRAFT_EDIT_TAB_ORDER) {
    if (!chapterDraftEditTabHasError(tab, errors)) continue;
    return CHAPTER_DRAFT_EDIT_TAB_LABELS[tab];
  }

  return null;
}
