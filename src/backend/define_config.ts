import type { CmsConfig } from '../types.js';

/**
 * Define shield configuration
 */
export function defineConfig(config: Partial<CmsConfig>): CmsConfig {
  return {
    meta: {
      name: 'Journey CMS',
      hasAppPreview: false,
      helpUrl: 'https://journeys.helpscoutdocs.com/',
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
      hasStories: true,
      hasEditReview: false,
      stories: [],
      ...config.stories,
    },

    streams: {
      hasStreams: true,
      streams: [],
      ...config.streams,
    },

    pages: {
      hasPages: true,
      schemaVersion: 1,
      tracking: 'utm_source=storyapp&utm_medium=referral&utm_campaign=page_menu',
      ...config.pages,
    },

    audience: {
      hasAudience: false,
      ...config.audience,
    },

    campaigns: {
      hasCampaigns: false,
      ...config.campaigns,
    },
  } satisfies CmsConfig;
}
