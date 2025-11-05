import { test, expect } from '@playwright/test';
import { DraftService } from '../../dist/backend/services/draft_service.js';
import { CmsService } from '../../dist/backend/services/cms_service.js';
import { simpleFields, complexFields, nestedFields } from '../mocks.js';
import type { StorySpec, Version, CmsConfig } from '../../src/types.js';

// Manual stub for Chapter.query() pattern
let mockQueryBuilder: {
  where: (spec: any) => typeof mockQueryBuilder;
  first: () => Promise<any>;
};

let ChapterModule: any;
let originalQuery: any;

async function setupChapterMock() {
  // Import from dist to avoid TypeScript decorator processing
  ChapterModule = await import('../../dist/backend/models/chapter.js');
  const Chapter = ChapterModule.default;

  mockQueryBuilder = {
    where: (spec: any) => {
      (mockQueryBuilder as any).lastWhereCall = spec;
      return mockQueryBuilder;
    },
    first: async () => {
      return (mockQueryBuilder as any).firstResult;
    },
  };

  // Store original and replace
  originalQuery = Chapter.query;
  (Chapter as any).query = () => mockQueryBuilder;
}

function teardownChapterMock() {
  if (ChapterModule && originalQuery) {
    const Chapter = ChapterModule.default;
    (Chapter as any).query = originalQuery;
  }
}

function createMockCmsConfig(sourceLocale: string = 'en'): CmsConfig {
  return {
    meta: {
      name: 'Test CMS',
      logo: '',
      hasAppPreview: false,
    },
    languages: {
      languages: [
        { locale: sourceLocale, language: 'English', languageDirection: 'ltr' },
        { locale: 'es', language: 'Spanish', languageDirection: 'ltr' },
        { locale: 'fr', language: 'French', languageDirection: 'ltr' },
      ],
      microcopySource: sourceLocale,
    },
    stories: {
      stories: [],
      hasStories: false,
      hasEditReview: false,
    },
    streams: {
      hasStreams: false,
      streams: [],
    },
    audience: {
      hasAudience: false,
    },
    pages: {
      hasPages: false,
      schemaVersion: 1,
      tracking: '',
    },
  };
}

function createStorySpec(id: number, fields = simpleFields): StorySpec {
  return {
    id,
    name: `Test Story ${id}`,
    coverImage: 'https://example.com/cover.jpg',
    chapterLimit: 100,
    chapterType: 'chapter',
    storyType: 'story',
    schemaVersion: 1,
    fields,
  };
}

test.describe('DraftService.getDraftBundle', () => {
  let mockCms: CmsService;
  let storySpec: StorySpec;

  test.beforeEach(async () => {
    await setupChapterMock();
    mockCms = new CmsService(createMockCmsConfig());
    storySpec = createStorySpec(1);
  });

  test.afterEach(() => {
    teardownChapterMock();
  });

  test('returns default bundle for source language', async () => {
    // arrange
    const draftService = new DraftService(storySpec, mockCms);
    const version: Version = {
      apiVersion: 1,
      locale: 'en', // source locale
      storyId: 1,
    };
    const number = 1;

    // act
    const result = await draftService.getDraftBundle(version, number);

    // assert
    expect(result).not.toBeNull();
    const parsed = JSON.parse(result!);
    expect(parsed.title).toBeDefined();
    expect(parsed.description).toBeDefined();
    expect(parsed.isActive).toBeDefined();
    expect(parsed.score).toBeDefined();
    // Verify Chapter.query was not called for source language
    expect((mockQueryBuilder as any).lastWhereCall).toBeUndefined();
  });

  test('returns fresh bundle from source chapter for translation', async () => {
    // arrange
    const draftService = new DraftService(storySpec, mockCms);
    const sourceBundle = {
      title: 'Source Title',
      description: 'Source Description',
      isActive: 'true',
      score: '10',
    };
    // Chapter.bundle is stored as a JSON string in the database
    // But getFreshBundleFrom expects an object, so we pass the parsed object
    // (In practice, Lucid might handle this, but for testing we use the object directly)
    const mockChapter = {
      bundle: sourceBundle, // Pass object directly since getFreshBundleFrom expects Record<string, any>
    } as any;

    (mockQueryBuilder as any).firstResult = mockChapter;

    const version: Version = {
      apiVersion: 1,
      locale: 'es', // translation locale
      storyId: 1,
    };
    const number = 1;

    // act
    const result = await draftService.getDraftBundle(version, number);

    // assert
    expect(result).not.toBeNull();
    const parsed = JSON.parse(result!);
    // For translation, string values should be cleared (not prefilled by default)
    expect(parsed.title).toBe(''); // cleared because 'title' is not in prefilledFields
    expect(parsed.description).toBe(''); // cleared
    // Numbers preserved (passed as string '10', but Number('10') is valid, so preserved)
    expect(parsed.score).toBe('10'); // number preserved
    expect((mockQueryBuilder as any).lastWhereCall).toEqual({
      apiVersion: 1,
      locale: 'en', // source locale
      storyId: 1,
      number: 1,
    });
  });

  test('returns null when source chapter not found for translation', async () => {
    // arrange
    const draftService = new DraftService(storySpec, mockCms);
    (mockQueryBuilder as any).firstResult = null;

    const version: Version = {
      apiVersion: 1,
      locale: 'fr', // translation locale
      storyId: 1,
    };
    const number = 1;

    // act
    const result = await draftService.getDraftBundle(version, number);

    // assert
    expect(result).toBeNull();
    expect((mockQueryBuilder as any).lastWhereCall).toEqual({
      apiVersion: 1,
      locale: 'en', // source locale
      storyId: 1,
      number: 1,
    });
  });

  test('preserves prefilled fields in translation bundle', async () => {
    // arrange
    const storyWithPrefilledFields = createStorySpec(1, [
      {
        name: 'title',
        label: 'Title',
        widget: 'string',
      },
      {
        name: 'scripture',
        label: 'Scripture',
        widget: 'scriptureReference', // prefilled field type
      },
      {
        name: 'image',
        label: 'Image',
        widget: 'image', // prefilled field type
      },
    ]);

    const draftService = new DraftService(storyWithPrefilledFields, mockCms);
    const sourceBundle = {
      title: 'Source Title',
      scripture: ['JHN.1.14'],
      image: 'https://example.com/image.jpg',
    };
    // source.bundle is cast as 'any' in the implementation
    // getFreshBundleFrom expects an object, so we pass the object directly
    const mockChapter = {
      bundle: sourceBundle,
    } as any;

    (mockQueryBuilder as any).firstResult = mockChapter;

    const version: Version = {
      apiVersion: 1,
      locale: 'es',
      storyId: 1,
    };
    const number = 1;

    // act
    const result = await draftService.getDraftBundle(version, number);

    // assert
    expect(result).not.toBeNull();
    const parsed = JSON.parse(result!);
    // Prefilled fields should be preserved
    expect(parsed.scripture).toEqual(['JHN.1.14']);
    expect(parsed.image).toBe('https://example.com/image.jpg');
    // Non-prefilled string fields should be cleared
    expect(parsed.title).toBe('');
  });

  test('handles nested objects in source bundle', async () => {
    // arrange
    const draftService = new DraftService(createStorySpec(1, nestedFields), mockCms);
    const sourceBundle = {
      title: 'Source Title',
      metadata: {
        author: 'John Doe',
        tags: [
          {
            icon: 'star',
            color: 1,
          },
        ],
        passage: ['JHN.1.14'],
      },
      body: 'Source Body',
      summary: 'Source Summary',
    };
    // source.bundle is cast as 'any' in the implementation
    // getFreshBundleFrom expects an object, so we pass the object directly
    const mockChapter = {
      bundle: sourceBundle,
    } as any;

    (mockQueryBuilder as any).firstResult = mockChapter;

    const version: Version = {
      apiVersion: 1,
      locale: 'es',
      storyId: 1,
    };
    const number = 1;

    // act
    const result = await draftService.getDraftBundle(version, number);

    // assert
    expect(result).not.toBeNull();
    const parsed = JSON.parse(result!);
    expect(parsed.metadata).toBeDefined();
    expect(parsed.metadata.author).toBe(''); // string cleared
    expect(parsed.metadata.tags).toBeDefined();
    expect(Array.isArray(parsed.metadata.tags)).toBe(true);
    expect(parsed.metadata.tags[0]).toBeDefined();
    expect(parsed.metadata.tags[0].icon).toBe(''); // string cleared
    expect(parsed.metadata.tags[0].color).toBe(1); // number prefilled
    expect(parsed.metadata.passage).toEqual(['JHN.1.14']); // scriptureReference is prefilled
  });

  test('handles arrays of strings in source bundle', async () => {
    // arrange
    const draftService = new DraftService(storySpec, mockCms);
    const sourceBundle = {
      title: 'Source Title',
      tags: ['tag1', 'tag2', 'tag3'], // array of strings
    };
    // source.bundle is cast as 'any' in the implementation
    // getFreshBundleFrom expects an object, so we pass the object directly
    const mockChapter = {
      bundle: sourceBundle,
    } as any;

    (mockQueryBuilder as any).firstResult = mockChapter;

    const version: Version = {
      apiVersion: 1,
      locale: 'es',
      storyId: 1,
    };
    const number = 1;

    // act
    const result = await draftService.getDraftBundle(version, number);

    // assert
    expect(result).not.toBeNull();
    const parsed = JSON.parse(result!);
    // Arrays of strings should be preserved as-is
    expect(parsed.tags).toEqual(['tag1', 'tag2', 'tag3']);
  });

  test('handles null values in source bundle', async () => {
    // arrange
    const draftService = new DraftService(storySpec, mockCms);
    const sourceBundle = {
      title: 'Source Title',
      description: null,
      score: null,
    };
    // source.bundle is cast as 'any' in the implementation
    // getFreshBundleFrom expects an object, so we pass the object directly
    const mockChapter = {
      bundle: sourceBundle,
    } as any;

    (mockQueryBuilder as any).firstResult = mockChapter;

    const version: Version = {
      apiVersion: 1,
      locale: 'es',
      storyId: 1,
    };
    const number = 1;

    // act
    const result = await draftService.getDraftBundle(version, number);

    // assert
    expect(result).not.toBeNull();
    const parsed = JSON.parse(result!);
    expect(parsed.description).toBeNull();
    expect(parsed.score).toBeNull();
  });

  test('handles complex fields bundle', async () => {
    // arrange
    const draftService = new DraftService(createStorySpec(1, complexFields), mockCms);
    const sourceBundle = {
      title: 'Source Title',
      scripture: {
        reference: 'John 3:16',
        verse: 'For God so loved the world...',
      },
      passage: ['JHN.3.16'],
      image: 'https://example.com/image.jpg',
    };
    // source.bundle is cast as 'any' in the implementation
    // getFreshBundleFrom expects an object, so we pass the object directly
    const mockChapter = {
      bundle: sourceBundle,
    } as any;

    (mockQueryBuilder as any).firstResult = mockChapter;

    const version: Version = {
      apiVersion: 1,
      locale: 'es',
      storyId: 1,
    };
    const number = 1;

    // act
    const result = await draftService.getDraftBundle(version, number);

    // assert
    expect(result).not.toBeNull();
    const parsed = JSON.parse(result!);
    // Prefilled fields should be preserved
    expect(parsed.passage).toEqual(['JHN.3.16']); // scriptureReference is prefilled
    expect(parsed.image).toBe('https://example.com/image.jpg'); // image is prefilled
    // Non-prefilled string fields should be cleared
    expect(parsed.title).toBe('');
  });

  test('uses correct source locale from CMS config', async () => {
    // arrange
    const customCms = new CmsService(createMockCmsConfig('de')); // German as source
    const draftService = new DraftService(storySpec, customCms);

    const version: Version = {
      apiVersion: 1,
      locale: 'en', // translation locale
      storyId: 1,
    };
    const number = 1;

    const sourceBundle = { title: 'German Title' };
    // source.bundle is cast as 'any' in the implementation
    // getFreshBundleFrom expects an object, so we pass the object directly
    const mockChapter = {
      bundle: sourceBundle,
    } as any;

    (mockQueryBuilder as any).firstResult = mockChapter;

    // act
    await draftService.getDraftBundle(version, number);

    // assert
    expect((mockQueryBuilder as any).lastWhereCall).toEqual({
      apiVersion: 1,
      locale: 'de', // should use first language from config as source
      storyId: 1,
      number: 1,
    });
  });
});
