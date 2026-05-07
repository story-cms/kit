import type { CmsConfig } from '../types.js';

/**
 * Define shield configuration
 */
export function defineConfig(config: Partial<CmsConfig>): CmsConfig {
  return {
    subscriptions: config.subscriptions || [
      'story',
      'stream',
      'language',
      'audience',
      'invitation',
      'page',
    ],
    name: config.name || 'Journeys Studio',
    hasAppPreview: config.hasAppPreview === undefined ? false : config.hasAppPreview,
    helpUrl: config.helpUrl || 'https://journeys.helpscoutdocs.com/',
    logo:
      config.logo ||
      'https://res.cloudinary.com/journeys/image/upload/v1756295658/logo_g8k7tf.png',

    microcopySource: config.microcopySource || '',
    languages: config.languages || [
      {
        locale: 'en',
        language: 'English',
        languageDirection: 'ltr',
        bibleVersion: 'de4e12af7f28f599-01',
      },
    ],

    storiesHasEditReview:
      config.storiesHasEditReview === undefined ? false : config.storiesHasEditReview,
    stories: config.stories || [],

    streams: config.streams || [],

    pagesSchemaVersion: config.pagesSchemaVersion || 1,
    pagesTracking:
      config.pagesTracking ||
      'utm_source=storyapp&utm_medium=referral&utm_campaign=page_menu',
  } satisfies CmsConfig;
}
