import type { CmsConfig } from '../types.js';

/**
 * Define shield configuration
 */
export function defineConfig(config: Partial<CmsConfig>): CmsConfig {
  return {
    name: config.name || 'Journeys Studio',

    logo:
      config.logo ||
      'https://res.cloudinary.com/journeys/image/upload/v1756295658/logo_g8k7tf.png',

    helpUrl: config.helpUrl || 'https://journeys.helpscoutdocs.com/',

    supportEmail: config.supportEmail || 'ops@startjourneys.io',

    hasAppPreview: config.hasAppPreview === undefined ? false : config.hasAppPreview,

    microcopySource: config.microcopySource || '',

    videoCollectionId: config.videoCollectionId || '',

    /**
     * A list of languages to be used in the app
     *
     * https://en.wikipedia.org/wiki/IETF_language_tag
     * https://r12a.github.io/app-subtags/
     */
    languages: config.languages || [
      {
        locale: 'en',
        language: 'English',
        languageDirection: 'ltr',
        bibleVersion: 'de4e12af7f28f599-01',
      },
    ],

    subscriptions: config.subscriptions || [
      'story',
      'stream',
      'language',
      'audience',
      'invitation',
      'page',
      'resource',
    ],

    pagesTracking:
      config.pagesTracking ||
      'utm_source=storyapp&utm_medium=referral&utm_campaign=page_menu',

    bespokeTemplates: config.bespokeTemplates || [],

    streams: config.streams || [],

    storiesHasEditReview:
      config.storiesHasEditReview === undefined ? false : config.storiesHasEditReview,

    storyTemplates: config.storyTemplates || [],
  } satisfies CmsConfig;
}

export interface mediaConfig {
  collection: string;
  description: string;
  extensions: string[];
  maxSize: number;
}
