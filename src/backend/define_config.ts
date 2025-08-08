import type { StoryConfig, CmsConfig } from '../types.js';

/**
 * Define shield configuration
 */
export function defineConfig(config: Partial<CmsConfig>): CmsConfig {
  return {
    meta: {
      name: 'Journey CMS',
      hasAppPreview: false,
      helpUrl: 'https://www.markdownguide.org',
      logo: '',
      ...config.meta,
    },
    languages: {
      microcopySource: config.languages?.microcopySource || '',
      languages: config.languages?.languages || [
        {
          locale: 'en',
          language: 'English',
          languageDirection: 'ltr',
          bibleVersion: 'de4e12af7f28f599-01',
        },
      ],
    },
    stories: {
      hasEditReview: false,
      stories: [],
      ...config.stories,
    },
    streams: {
      streams: [],
      ...config.streams,
    },
    pages: {
      schemaVersion: 1,
      tracking: 'utm_source=storyapp&utm_medium=referral&utm_campaign=page_menu',
      ...config.pages,
    },
  } satisfies CmsConfig;
}

// TODO: deprecate
export function defineStoryConfig(config: Partial<StoryConfig>): StoryConfig {
  return {
    meta: {
      name: 'Story CMS',
      chapterType: 'Chapter',
      hasAppPreview: false,
      hasEditReview: false,
      helpUrl: 'https://www.markdownguide.org',
      storyType: 'Edition',
      logo: '',
      ...config.meta,
    },
    languages: config.languages || [
      {
        locale: 'en',
        language: 'English',
        languageDirection: 'ltr',
        bibleVersion: 'de4e12af7f28f599-01',
      },
    ],
    schemaVersion: config.schemaVersion || 1,
    stories: config.stories || [],
    pages: {
      schemaVersion: 1,
      tracking:
        config.pages?.tracking ||
        'utm_source=storyapp&utm_medium=referral&utm_campaign=page_menu',
    },
  } satisfies StoryConfig;
}
