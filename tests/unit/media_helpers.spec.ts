import { test, expect } from '@playwright/test';

import type { CmsConfig } from '../../src/types.js';
import {
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
    bespokeTemplates: [
      {
        id: 'daily-grace',
        name: 'Daily Grace',
        fields: [],
        collections: { video: 'bespoke-video-id' },
      },
    ],
    streams: [],
    storiesHasEditReview: false,
    storyTemplates: [
      {
        id: 'course',
        name: 'Course',
        fields: [],
      },
      {
        id: 'devotion',
        name: 'Devotion',
        fields: [],
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

  test('mediaCollectionsForTemplate returns globals for built-in templates', () => {
    expect(mediaCollectionsForTemplate(baseConfig, 'course')).toEqual({
      video: 'video-id',
      image: 'image-id',
      audio: 'audio-id',
    });
  });

  test('mediaCollectionsForTemplate returns globals for unknown template ids', () => {
    expect(mediaCollectionsForTemplate(baseConfig, 'missing')).toEqual({
      video: 'video-id',
      image: 'image-id',
      audio: 'audio-id',
    });
  });

  test('mediaCollectionsForTemplate overlays bespoke collections on globals', () => {
    expect(mediaCollectionsForTemplate(baseConfig, 'daily-grace')).toEqual({
      video: 'bespoke-video-id',
      image: 'image-id',
      audio: 'audio-id',
    });
  });
});
