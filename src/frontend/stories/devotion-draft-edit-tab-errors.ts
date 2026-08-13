export type DevotionDraftEditTab = 'details' | 'blocks' | 'resources';

const DEVOTION_DRAFT_EDIT_TAB_ORDER: DevotionDraftEditTab[] = [
  'details',
  'blocks',
  'resources',
];

const DEVOTION_DRAFT_EDIT_TAB_LABELS: Record<DevotionDraftEditTab, string> = {
  details: 'Details',
  blocks: 'Blocks',
  resources: 'Resources',
};

function matchesErrorPrefix(key: string, prefix: string): boolean {
  return key === prefix || key.startsWith(`${prefix}.`);
}

function errorKeyBelongsToTab(key: string, tab: DevotionDraftEditTab): boolean {
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

export function devotionDraftEditTabHasError(
  tab: DevotionDraftEditTab,
  errors: Record<string, string | string[]>,
): boolean {
  return Object.keys(errors).some((key) => errorKeyBelongsToTab(key, tab));
}

export function firstDevotionDraftEditTabWithError(
  errors: Record<string, string | string[]>,
): string | null {
  for (const tab of DEVOTION_DRAFT_EDIT_TAB_ORDER) {
    if (!devotionDraftEditTabHasError(tab, errors)) continue;
    return DEVOTION_DRAFT_EDIT_TAB_LABELS[tab];
  }

  return null;
}
