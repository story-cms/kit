import { test, expect } from '@playwright/test';

import type { CmsConfig } from '../../src/types.js';
import {
  assertTemplateCollectionsMatchGlobals,
  buildMediaFieldSpec,
  globalMediaCollections,
  mediaCollectionsForTemplate,
} from '../../src/shared/media_helpers.js';
import {
  audioUploadConfig,
  imageUploadConfig,
  videoUploadConfig,
} from '../../src/shared/media_upload_configs.js';

test.describe('buildMediaFieldSpec', () => {
  test('builds video field spec with collectionId', () => {
    const spec = buildMediaFieldSpec('video', 'bunny-collection-id', {
      label: 'Session Video',
      name: 'sessionVideo',
    });

    expect(spec).toEqual({
      label: 'Session Video',
      name: 'sessionVideo',
      widget: 'video',
      description: videoUploadConfig.description,
      extensions: videoUploadConfig.extensions,
      maxSize: videoUploadConfig.maxSize,
      collectionId: 'bunny-collection-id',
    });
  });

  test('builds image field spec with uploadPreset', () => {
    const spec = buildMediaFieldSpec('image', 'journeys_template');

    expect(spec.widget).toBe('image');
    expect(spec.uploadPreset).toBe('journeys_template');
    expect(spec.description).toBe(imageUploadConfig.description);
    expect(spec.extensions).toEqual(imageUploadConfig.extensions);
    expect(spec.maxSize).toBe(imageUploadConfig.maxSize);
  });

  test('builds audio field spec with folder', () => {
    const spec = buildMediaFieldSpec('audio', 'audio/devotion');

    expect(spec.widget).toBe('audio');
    expect(spec.folder).toBe('audio/devotion');
    expect(spec.description).toBe(audioUploadConfig.description);
    expect(spec.extensions).toEqual(audioUploadConfig.extensions);
    expect(spec.maxSize).toBe(audioUploadConfig.maxSize);
  });
});

test.describe('media collection helpers', () => {
  const baseConfig: CmsConfig = {
    name: 'Test',
    logo: '',
    helpUrl: '',
    supportEmail: '',
    hasAppPreview: false,
    microcopySource: '',
    videoCollectionId: 'video-id',
    imageCollectionId: 'image-id',
    audioCollectionId: 'audio-id',
    languages: [],
    subscriptions: [],
    pagesTracking: '',
    bespokeTemplates: [],
    streams: [],
    storiesHasEditReview: false,
    storyTemplates: [
      {
        id: 'course',
        name: 'Course',
        fields: [],
        collections: { video: 'video-id', image: 'image-id' },
      },
      {
        id: 'devotion',
        name: 'Devotion',
        fields: [],
        collections: {
          video: 'video-id',
          image: 'image-id',
          audio: 'audio-id',
        },
      },
    ],
  };

  test('globalMediaCollections returns all global IDs', () => {
    expect(globalMediaCollections(baseConfig)).toEqual({
      video: 'video-id',
      image: 'image-id',
      audio: 'audio-id',
    });
  });

  test('mediaCollectionsForTemplate returns template collections', () => {
    expect(mediaCollectionsForTemplate(baseConfig, 'devotion')).toEqual({
      video: 'video-id',
      image: 'image-id',
      audio: 'audio-id',
    });
    expect(mediaCollectionsForTemplate(baseConfig, 'missing')).toEqual({});
  });

  test('assertTemplateCollectionsMatchGlobals passes when values match', () => {
    expect(() => assertTemplateCollectionsMatchGlobals(baseConfig)).not.toThrow();
  });

  test('assertTemplateCollectionsMatchGlobals throws when values mismatch', () => {
    const invalidConfig: CmsConfig = {
      ...baseConfig,
      storyTemplates: [
        {
          id: 'course',
          name: 'Course',
          fields: [],
          collections: { video: 'wrong-id', image: 'image-id' },
        },
      ],
    };

    expect(() => assertTemplateCollectionsMatchGlobals(invalidConfig)).toThrow(
      'Template "course" collections.video does not match global videoCollectionId',
    );
  });
});
