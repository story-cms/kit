export type StoryEditTab = 'details' | 'sections' | 'resources';

const STORY_EDIT_TAB_LABELS: Record<
  StoryEditTab,
  string | ((sectionTabLabel: string) => string)
> = {
  details: 'Details',
  sections: (sectionTabLabel) => sectionTabLabel,
  resources: 'Resources',
};

function storyEditTabOrder(hasSections: boolean): StoryEditTab[] {
  return hasSections ? ['details', 'sections', 'resources'] : ['details', 'resources'];
}

function errorKeyBelongsToTab(
  key: string,
  tab: StoryEditTab,
  hasSections: boolean,
): boolean {
  if (tab === 'sections') {
    return hasSections && key.startsWith('bundle.sections');
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
  hasSections = true,
): boolean {
  if (!hasSections && tab === 'sections') return false;

  return Object.keys(errors).some((key) => errorKeyBelongsToTab(key, tab, hasSections));
}

export function firstStoryEditTabWithError(
  errors: Record<string, string | string[]>,
  sectionTabLabel: string,
  hasSections = true,
): string | null {
  for (const tab of storyEditTabOrder(hasSections)) {
    if (!storyEditTabHasError(tab, errors, hasSections)) continue;

    const label = STORY_EDIT_TAB_LABELS[tab];
    return typeof label === 'function' ? label(sectionTabLabel) : label;
  }

  return null;
}
