export type StoryEditTab = 'details' | 'sections' | 'resources';

const STORY_EDIT_TAB_ORDER: StoryEditTab[] = ['details', 'sections', 'resources'];

const STORY_EDIT_TAB_LABELS: Record<StoryEditTab, string | ((sectionTabLabel: string) => string)> = {
  details: 'Details',
  sections: (sectionTabLabel) => sectionTabLabel,
  resources: 'Resources',
};

function errorKeyBelongsToTab(key: string, tab: StoryEditTab): boolean {
  if (tab === 'sections') {
    return key.startsWith('bundle.sections');
  }
  if (tab === 'resources') {
    return key.startsWith('bundle.resources');
  }
  return (
    key.startsWith('bundle.') &&
    !key.startsWith('bundle.sections') &&
    !key.startsWith('bundle.resources')
  );
}

export function storyEditTabHasError(
  tab: StoryEditTab,
  errors: Record<string, string | string[]>,
): boolean {
  return Object.keys(errors).some((key) => errorKeyBelongsToTab(key, tab));
}

export function firstStoryEditTabWithError(
  errors: Record<string, string | string[]>,
  sectionTabLabel: string,
): string | null {
  for (const tab of STORY_EDIT_TAB_ORDER) {
    if (!storyEditTabHasError(tab, errors)) continue;

    const label = STORY_EDIT_TAB_LABELS[tab];
    return typeof label === 'function' ? label(sectionTabLabel) : label;
  }

  return null;
}
