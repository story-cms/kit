import type { CmsConfig, FieldSpec } from '../types.js';

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

// -------------------------------------
// standard content templates
// -------------------------------------

export interface mediaConfig {
  collection: string;
  description: string;
  extensions: string[];
  maxSize: number;
}

export function courseFields(video: mediaConfig, image: mediaConfig): FieldSpec[] {
  return [
    {
      name: 'screens',
      label: 'Screen',
      widget: 'list',
      fields: [
        {
          name: 'screenName',
          label: 'Screen Name',
          widget: 'string',
        },
        {
          name: 'displayTitle',
          label: 'Display Title',
          widget: 'string',
        },
        {
          name: 'heroImage',
          label: 'Hero Image',
          widget: 'image',
          description: image.description,
          extensions: image.extensions,
          maxSize: image.maxSize,
          uploadPreset: image.collection,
        },
        {
          name: 'sessionVideo',
          label: 'Session Video',
          widget: 'video',
          description: video.description,
          extensions: video.extensions,
          maxSize: video.maxSize,
          collectionId: video.collection,
        },
        {
          name: 'bodyText',
          label: 'Body Text',
          widget: 'markdown',
          toolbar: [
            'bold',
            'italic',
            'heading-1',
            'heading-2',
            'heading-3',
            'unordered-list',
            'ordered-list',
            'link',
            'horizontal-rule',
          ],
        },
        {
          name: 'screenStyle',
          label: 'Screen Style',
          widget: 'select',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
          ],
          default: 'primary',
        },
      ],
    },
  ];
}
