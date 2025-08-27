import type { CmsConfig } from '../types.js';

/**
 * Define shield configuration
 */
export function defineConfig(config: Partial<CmsConfig>): CmsConfig {
  return {
    meta: {
      name: 'Journey CMS',
      hasAppPreview: false,
      helpUrl: 'https://www.markdownguide.org',
      logo: 'https://res.cloudinary.com/journeys/image/upload/v1756295658/logo_g8k7tf.png',
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
