import { test, expect } from '@playwright/test';
import { DateTime } from 'luxon';
import { DraftService } from '../../dist/backend/services/draft_service.js';
import { simpleFields, complexFields, nestedFields } from '../mocks.js';
import type { StorySpec, StoryVersion, CmsConfig, Providers } from '../../src/types.js';

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
    name: 'Test CMS',
    logo: '',
    helpUrl: 'https://example.com/help',
    hasAppPreview: false,
    microcopySource: sourceLocale,
    languages: [
      { locale: sourceLocale, language: 'English', languageDirection: 'ltr' },
      { locale: 'es', language: 'Spanish', languageDirection: 'ltr' },
      { locale: 'fr', language: 'French', languageDirection: 'ltr' },
    ],
    streams: [],
    storiesHasEditReview: false,
    storyTemplates: [],
    bespokeTemplates: [],
    pagesTracking: '',
    subscriptions: ['story', 'stream', 'language', 'audience', 'invitation', 'page'],
  };
}

function createMockCms(sourceLocale: string = 'en') {
  const config = createMockCmsConfig(sourceLocale);
  return {
    get sourceLocale() {
      return config.languages[0].locale;
    },
    get config() {
      return config;
    },
  } as any;
}

function createStorySpec(id: number, fields = simpleFields): StorySpec {
  return {
    id,
    name: `Test Story ${id}`,
    coverImage: 'https://example.com/cover.jpg',
    chapterLimit: 100,
    chapterType: 'chapter',
    storyType: 'story',
    visibility: 'public',
    schemaVersion: 1,
    isPublished: true,
    fields,
  };
}

test.describe('DraftService.getDraftBundle', () => {
  let mockCms: any;
  let storySpec: StorySpec;

  test.beforeEach(async () => {
    await setupChapterMock();
    mockCms = createMockCms();
    storySpec = createStorySpec(1);
  });

  test.afterEach(() => {
    teardownChapterMock();
  });

  test('returns default bundle for source language', async () => {
    // arrange
    const draftService = new DraftService(storySpec, mockCms);
    const version: StoryVersion = {
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

  test('returns the devotion bundle for a source-locale devotion story', async () => {
    storySpec.template = 'devotion';
    const draftService = new DraftService(storySpec, mockCms);

    const result = await draftService.getDraftBundle(
      { apiVersion: 1, locale: 'en', storyId: storySpec.id },
      4,
    );

    expect(JSON.parse(result!)).toEqual({
      number: '04',
      title: '',
      description: '',
      coverImage: '',
      devotionAudio: { url: null, length: null },
      blocks: [],
      resources: [],
    });
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

    const version: StoryVersion = {
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

  test('returns the source structure but not its content for a devotion translation', async () => {
    // arrange
    storySpec.template = 'devotion';
    const draftService = new DraftService(storySpec, mockCms);
    const sourceBundle = {
      number: '01',
      title: 'Source Title',
      description: 'Source Description',
      coverImage: 'https://example.com/cover.jpg',
      devotionAudio: { url: 'https://example.com/audio.mp3', length: 42 },
      blocks: [
        {
          id: 'block-1',
          kind: 'content',
          blockName: 'Welcome',
          displayName: 'Welcome',
          blockRole: 'introduction',
          style: 'primary',
          content: 'Source content',
          items: [],
          visibility: {
            presenter: false,
            personal: false,
            inNavigation: false,
            hidden: false,
          },
          leadersNotes: '',
          showLeadersNotes: false,
        },
      ],
      resources: ['source-resource-1'],
    };
    const mockChapter = { bundle: sourceBundle } as any;
    (mockQueryBuilder as any).firstResult = mockChapter;

    const version: StoryVersion = {
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
    // Block kind/role/style survive so the translator gets the same
    // structure as the source, but its kind must not render as an
    // unrenderable empty-kind block.
    expect(parsed.blocks).toHaveLength(1);
    expect(parsed.blocks[0].kind).toBe('content');
    expect(parsed.blocks[0].blockRole).toBe('introduction');
    expect(parsed.blocks[0].style).toBe('primary');
    // Source-language text must not leak into the translation draft.
    expect(parsed.title).toBe('');
    expect(parsed.description).toBe('');
    expect(parsed.blocks[0].blockName).toBe('');
    expect(parsed.blocks[0].displayName).toBe('');
    expect(parsed.blocks[0].content).toBe('');
    // Cover image is a shared visual asset, kept as-is.
    expect(parsed.coverImage).toBe('https://example.com/cover.jpg');
    // Audio and resources are locale-specific and must not carry over.
    expect(parsed.devotionAudio).toEqual({ url: null, length: null });
    expect(parsed.resources).toEqual([]);
  });

  test('returns null when source chapter not found for translation', async () => {
    // arrange
    const draftService = new DraftService(storySpec, mockCms);
    (mockQueryBuilder as any).firstResult = null;

    const version: StoryVersion = {
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
      {
        name: 'window',
        label: 'Window',
        widget: 'dateRange', // prefilled field type
      },
    ]);

    const draftService = new DraftService(storyWithPrefilledFields, mockCms);
    const sourceBundle = {
      title: 'Source Title',
      scripture: ['JHN.1.14'],
      image: 'https://example.com/image.jpg',
      window: '2025-01-01T00:00:00.000Z|2025-01-02T00:00:00.000Z',
    };
    // source.bundle is cast as 'any' in the implementation
    // getFreshBundleFrom expects an object, so we pass the object directly
    const mockChapter = {
      bundle: sourceBundle,
    } as any;

    (mockQueryBuilder as any).firstResult = mockChapter;

    const version: StoryVersion = {
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
    expect(parsed.window).toBe('2025-01-01T00:00:00.000Z|2025-01-02T00:00:00.000Z');

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

    const version: StoryVersion = {
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

    const version: StoryVersion = {
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

    const version: StoryVersion = {
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

    const version: StoryVersion = {
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
    const customCms = createMockCms('de'); // German as source
    const draftService = new DraftService(storySpec, customCms);

    const version: StoryVersion = {
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

test.describe('DraftService.create', () => {
  let mockCms: any;
  let DraftModule: any;
  let originalDraftCreate: any;
  let createPayload: any;

  test.beforeEach(async () => {
    await setupChapterMock();
    mockCms = createMockCms();
    createPayload = undefined;
    DraftModule = await import('../../dist/backend/models/draft.js');

    const Draft = DraftModule.default;
    originalDraftCreate = Draft.create;
    Draft.create = async (payload: any) => {
      createPayload = payload;
      return createMockDraft({ id: 21, number: payload.number, bundle: payload.bundle });
    };
  });

  test.afterEach(() => {
    teardownChapterMock();
    DraftModule.default.create = originalDraftCreate;
  });

  test('creates and returns a source-locale draft', async () => {
    const storySpec = createStorySpec(1);
    storySpec.template = 'course';
    const service = new DraftService(storySpec, mockCms);
    const version = { apiVersion: 1, locale: 'en', storyId: 1 };

    const draft = await service.create(version, 3);

    expect(draft?.id).toBe(21);
    expect(createPayload).toEqual({
      ...version,
      number: 3,
      bundle: JSON.stringify({
        number: '03',
        title: '',
        description: '',
        coverImage: '',
        blocks: [],
        resources: [],
      }),
    });
  });

  test('preserves configured fields when creating a translation draft', async () => {
    const storySpec = createStorySpec(1);
    const service = new DraftService(storySpec, mockCms);
    service.setPrefilledFields(['imageUrl']);
    (mockQueryBuilder as any).firstResult = {
      bundle: { title: 'Source title', imageUrl: 'https://example.com/image.jpg' },
    };

    const draft = await service.create({ apiVersion: 1, locale: 'es', storyId: 1 }, 1);

    expect(draft).not.toBeNull();
    expect(JSON.parse(createPayload.bundle)).toEqual({
      title: '',
      imageUrl: 'https://example.com/image.jpg',
    });
  });

  test('returns null without persisting when a translation source is missing', async () => {
    const service = new DraftService(createStorySpec(1), mockCms);
    (mockQueryBuilder as any).firstResult = null;

    const draft = await service.create({ apiVersion: 1, locale: 'es', storyId: 1 }, 1);

    expect(draft).toBeNull();
    expect(createPayload).toBeUndefined();
  });
});

const emptyProviders = {} as Providers;

const devotionBundle = {
  number: '01',
  title: 'Morning devotion',
  description: '',
  coverImage: '',
  devotionAudio: { url: null, length: null },
  blocks: [],
  resources: [],
};

const courseBundle = {
  number: '01',
  title: 'Session one',
  description: '',
  coverImage: '',
  blocks: [],
  resources: [],
};

function createMockDraft(options: {
  id?: number;
  number?: number;
  bundle?: Record<string, unknown>;
}) {
  const updatedAt = DateTime.fromISO('2024-01-02T12:00:00.000Z');
  const createdAt = DateTime.fromISO('2024-01-01T12:00:00.000Z');

  return {
    id: options.id ?? 7,
    number: options.number ?? 1,
    bundle: options.bundle ?? devotionBundle,
    updatedAt,
    createdAt,
    get meta() {
      return {
        id: this.id,
        number: this.number,
        status: 'started',
        updatedAt: updatedAt.toString(),
        createdAt: createdAt.toString(),
      };
    },
  };
}

function createMockChapter(bundle: Record<string, unknown>) {
  const updatedAt = DateTime.fromISO('2024-01-03T12:00:00.000Z');
  return {
    bundle,
    updatedAt,
  };
}

test.describe('DraftService.editProps', () => {
  let mockCms: any;
  let DraftModule: any;
  let ChapterModule: any;
  let draftQueryBuilder: any;
  let chapterQueryBuilder: any;
  let originalDraftQuery: any;
  let originalChapterQuery: any;
  let originalDraftCreate: any;
  let availableResources: any[];
  let hydratedResources: any[];
  let hydratedResourceIds: string[];

  const createEditService = (storySpec: StorySpec) =>
    new DraftService(storySpec, mockCms, {
      resourceService: {
        listForLocale: async () => availableResources,
        hydrate: async (ids) => {
          hydratedResourceIds = ids;
          return hydratedResources;
        },
      },
    });

  test.beforeEach(async () => {
    mockCms = createMockCms();
    DraftModule = await import('../../dist/backend/models/draft.js');
    ChapterModule = await import('../../dist/backend/models/chapter.js');

    draftQueryBuilder = {
      where: (spec: any) => {
        draftQueryBuilder.lastWhereCall = spec;
        return draftQueryBuilder;
      },
      first: async () => draftQueryBuilder.firstResult,
    };

    chapterQueryBuilder = {
      where: (spec: any) => {
        chapterQueryBuilder.lastWhereCall = spec;
        return chapterQueryBuilder;
      },
      first: async () => chapterQueryBuilder.firstResult,
    };

    const Draft = DraftModule.default;
    const Chapter = ChapterModule.default;
    originalDraftQuery = Draft.query;
    originalChapterQuery = Chapter.query;
    originalDraftCreate = Draft.create;
    Draft.query = () => draftQueryBuilder;
    Chapter.query = () => chapterQueryBuilder;
    Draft.create = async (payload: any) => {
      draftQueryBuilder.createPayload = payload;
      return createMockDraft({ bundle: payload.bundle });
    };

    availableResources = [];
    hydratedResources = [];
    hydratedResourceIds = [];
  });

  test.afterEach(() => {
    const Draft = DraftModule.default;
    const Chapter = ChapterModule.default;
    Draft.query = originalDraftQuery;
    Chapter.query = originalChapterQuery;
    Draft.create = originalDraftCreate;
  });

  test('returns null when no draft or chapter exists', async () => {
    draftQueryBuilder.firstResult = null;
    chapterQueryBuilder.firstResult = null;

    const storySpec = createStorySpec(1);
    storySpec.template = 'devotion';
    const draftService = createEditService(storySpec);

    const result = await draftService.editProps({
      version: { apiVersion: 1, locale: 'en', storyId: 1 },
      number: 1,
      providers: emptyProviders,
    });

    expect(result).toBeNull();
  });

  test('returns base props for a generic source-locale draft', async () => {
    const bundle = { title: 'Generic chapter' };
    draftQueryBuilder.firstResult = createMockDraft({ bundle });
    chapterQueryBuilder.firstResult = createMockChapter(bundle);

    const storySpec = createStorySpec(1);
    storySpec.template = 'custom-template';
    const draftService = createEditService(storySpec);

    const result = await draftService.editProps({
      version: { apiVersion: 1, locale: 'en', storyId: 1 },
      number: 1,
      providers: emptyProviders,
    });

    expect(result).not.toBeNull();
    expect(result?.bundle).toEqual(bundle);
    expect(result?.source).toBeUndefined();
    expect(result?.story).toBe(storySpec);
  });

  test('returns a source bundle for a generic translation draft', async () => {
    draftQueryBuilder.firstResult = createMockDraft({
      bundle: { title: 'Translated chapter' },
    });
    chapterQueryBuilder.first = async () => {
      const spec = chapterQueryBuilder.lastWhereCall;
      return createMockChapter({
        title: spec?.locale === 'en' ? 'Source chapter' : 'Published translation',
      });
    };

    const storySpec = createStorySpec(1);
    storySpec.template = 'custom-template';
    const draftService = createEditService(storySpec);

    const result = await draftService.editProps({
      version: { apiVersion: 1, locale: 'es', storyId: 1 },
      number: 1,
      providers: emptyProviders,
    });

    expect(result?.bundle).toEqual({ title: 'Translated chapter' });
    expect(result?.source).toEqual({ title: 'Source chapter' });
  });

  test('returns source-locale devotion props with hydrated resources', async () => {
    const bundle = { ...devotionBundle, resources: ['attached-resource'] };
    const chapter = createMockChapter(bundle);
    draftQueryBuilder.firstResult = createMockDraft({ id: 11, bundle });
    chapterQueryBuilder.firstResult = chapter;
    availableResources = [{ id: 'available-resource' }];
    hydratedResources = [{ id: 'attached-resource' }];

    const storySpec = createStorySpec(1);
    storySpec.template = 'devotion';
    const draftService = createEditService(storySpec);

    const result = await draftService.editProps({
      version: { apiVersion: 1, locale: 'en', storyId: 1 },
      number: 1,
      providers: emptyProviders,
      newDraftId: 11,
    });

    expect(result).not.toBeNull();
    if (!result || !('availableResources' in result)) return;
    expect(result.isCreate).toBe(true);
    expect(result.bundle.title).toBe('Morning devotion');
    expect(result.bundle.resources).toEqual(hydratedResources);
    expect(result.availableResources).toEqual(availableResources);
    expect(result.lastPublished).toBe(chapter.updatedAt.toString());
    expect(hydratedResourceIds).toEqual(['attached-resource']);
  });

  test('returns source-locale course props', async () => {
    draftQueryBuilder.firstResult = createMockDraft({ id: 12, bundle: courseBundle });
    chapterQueryBuilder.firstResult = createMockChapter(courseBundle);

    const storySpec = createStorySpec(1);
    storySpec.template = 'course';
    const draftService = createEditService(storySpec);

    const result = await draftService.editProps({
      version: { apiVersion: 1, locale: 'en', storyId: 1 },
      number: 1,
      providers: emptyProviders,
      newDraftId: 12,
    });

    expect(result).not.toBeNull();
    if (!result || !('availableResources' in result)) return;
    expect(result.isCreate).toBe(true);
    expect(result.bundle.title).toBe('Session one');
    expect(result.previousChapterBlocks).toEqual([]);
  });

  test('returns devotion translation props with a source bundle', async () => {
    draftQueryBuilder.firstResult = createMockDraft({
      id: 13,
      bundle: { ...devotionBundle, title: 'Spanish devotion' },
    });
    chapterQueryBuilder.firstResult = createMockChapter({
      ...devotionBundle,
      title: 'English devotion',
    });

    const storySpec = createStorySpec(1);
    storySpec.template = 'devotion';
    const draftService = createEditService(storySpec);

    const result = await draftService.editProps({
      version: { apiVersion: 1, locale: 'es', storyId: 1 },
      number: 1,
      providers: emptyProviders,
    });

    expect(result).not.toBeNull();
    if (!result || !('previousChapterBlocks' in result)) return;
    expect(result.source?.title).toBe('English devotion');
    expect(result.previousChapterBlocks).toEqual([]);
  });

  test('returns course translation props with a source bundle', async () => {
    draftQueryBuilder.firstResult = createMockDraft({
      id: 14,
      bundle: { ...courseBundle, title: 'Spanish course session' },
    });
    chapterQueryBuilder.firstResult = createMockChapter({
      ...courseBundle,
      title: 'English course session',
    });

    const storySpec = createStorySpec(1);
    storySpec.template = 'course';
    const draftService = createEditService(storySpec);

    const result = await draftService.editProps({
      version: { apiVersion: 1, locale: 'es', storyId: 1 },
      number: 1,
      providers: emptyProviders,
    });

    expect(result).not.toBeNull();
    if (!result || !('previousChapterBlocks' in result)) return;
    expect(result.source?.title).toBe('English course session');
    expect(result.previousChapterBlocks).toEqual([]);
  });

  test('normalizes an empty source bundle when a translation source is missing', async () => {
    draftQueryBuilder.firstResult = createMockDraft({
      id: 15,
      bundle: { ...devotionBundle, title: 'Spanish devotion' },
    });

    chapterQueryBuilder.first = async () => {
      const spec = chapterQueryBuilder.lastWhereCall;
      return spec?.locale === 'es' ? createMockChapter(devotionBundle) : null;
    };

    const storySpec = createStorySpec(1);
    storySpec.template = 'devotion';
    const draftService = createEditService(storySpec);

    const result = await draftService.editProps({
      version: { apiVersion: 1, locale: 'es', storyId: 1 },
      number: 1,
      providers: emptyProviders,
    });

    expect(result).not.toBeNull();
    if (!result || !('previousChapterBlocks' in result)) return;
    expect(result.source).toEqual({
      number: '01',
      title: '',
      description: '',
      coverImage: '',
      devotionAudio: { url: null, length: null },
      blocks: [],
      resources: [],
    });
  });

  test('loads previous chapter blocks for chapter two devotion drafts', async () => {
    const previousBlock = {
      id: 'block-1',
      kind: 'content',
      blockName: 'Opening',
      displayName: 'Opening',
      blockRole: 'introduction',
      style: 'primary',
      content: 'Previous content',
      items: [],
      visibility: {
        presenter: false,
        personal: false,
        inNavigation: false,
        hidden: false,
      },
      leadersNotes: '',
      showLeadersNotes: false,
    };

    draftQueryBuilder.firstResult = createMockDraft({
      id: 14,
      number: 2,
      bundle: { ...devotionBundle, number: '02', blocks: [] },
    });
    chapterQueryBuilder.firstResult = createMockChapter({
      ...devotionBundle,
      number: '02',
    });

    const originalDraftFirst = draftQueryBuilder.first;
    const originalChapterFirst = chapterQueryBuilder.first;

    draftQueryBuilder.first = async () => {
      const spec = draftQueryBuilder.lastWhereCall;
      if (spec?.number === 1) {
        return null;
      }
      return draftQueryBuilder.firstResult;
    };

    chapterQueryBuilder.first = async () => {
      const spec = chapterQueryBuilder.lastWhereCall;
      if (spec?.number === 1) {
        return createMockChapter({
          ...devotionBundle,
          number: '01',
          blocks: [previousBlock],
        });
      }
      return chapterQueryBuilder.firstResult;
    };

    const storySpec = createStorySpec(1);
    storySpec.template = 'devotion';
    const draftService = createEditService(storySpec);

    const result = await draftService.editProps({
      version: { apiVersion: 1, locale: 'en', storyId: 1 },
      number: 2,
      providers: emptyProviders,
    });

    draftQueryBuilder.first = originalDraftFirst;
    chapterQueryBuilder.first = originalChapterFirst;

    expect(result).not.toBeNull();
    if (!result || !('previousChapterBlocks' in result)) return;
    expect(result.previousChapterBlocks).toHaveLength(1);
    expect(result.previousChapterBlocks?.[0]?.blockName).toBe('Opening');
  });

  test('prefers a previous draft over its published chapter', async () => {
    const draftBlock = {
      id: 'draft-block',
      kind: 'content',
      blockName: 'Draft opening',
      displayName: 'Draft opening',
      blockRole: 'introduction',
      style: 'primary',
      content: 'Draft content',
      items: [],
      visibility: {
        presenter: false,
        personal: false,
        inNavigation: false,
        hidden: false,
      },
      leadersNotes: '',
      showLeadersNotes: false,
    };
    const chapterBlock = { ...draftBlock, id: 'chapter-block', blockName: 'Published' };
    const currentDraft = createMockDraft({
      id: 16,
      number: 2,
      bundle: { ...courseBundle, number: '02' },
    });
    const previousDraft = createMockDraft({
      id: 15,
      number: 1,
      bundle: { ...courseBundle, blocks: [draftBlock] },
    });

    draftQueryBuilder.first = async () =>
      draftQueryBuilder.lastWhereCall?.number === 1 ? previousDraft : currentDraft;
    chapterQueryBuilder.first = async () =>
      createMockChapter({ ...courseBundle, blocks: [chapterBlock] });

    const storySpec = createStorySpec(1);
    storySpec.template = 'course';
    const result = await createEditService(storySpec).editProps({
      version: { apiVersion: 1, locale: 'en', storyId: 1 },
      number: 2,
      providers: emptyProviders,
    });

    expect(result).not.toBeNull();
    if (!result || !('previousChapterBlocks' in result)) return;
    expect(result.previousChapterBlocks?.[0]?.id).toBe('draft-block');
  });

  test('creates a draft from chapter when missing', async () => {
    draftQueryBuilder.firstResult = null;
    chapterQueryBuilder.firstResult = createMockChapter(devotionBundle);

    const storySpec = createStorySpec(1);
    storySpec.template = 'test-story';
    const draftService = createEditService(storySpec);

    const result = await draftService.editProps({
      version: { apiVersion: 1, locale: 'en', storyId: 1 },
      number: 1,
      providers: emptyProviders,
    });

    expect(draftQueryBuilder.createPayload).toEqual({
      apiVersion: 1,
      locale: 'en',
      storyId: 1,
      number: 1,
      bundle: devotionBundle,
    });
    expect(result).not.toBeNull();
    expect(result?.bundle).toEqual(devotionBundle);
  });
});

test.describe('DraftService.editPage', () => {
  const cms = createMockCms();

  test('selects the default editor pages', () => {
    const service = new DraftService(createStorySpec(1), cms);
    expect(service.editPage(false)).toBe('DraftIndex');
    expect(service.editPage(true)).toBe('TranslationIndex');
  });

  test('selects the standard chapter editor for devotion and course', () => {
    const devotion = createStorySpec(1);
    devotion.template = 'devotion';
    expect(new DraftService(devotion, cms).editPage(false)).toBe('StandardChapterEdit');
    expect(new DraftService(devotion, cms).editPage(true)).toBe('StandardChapterEdit');

    const course = createStorySpec(1);
    course.template = 'course';
    expect(new DraftService(course, cms).editPage(false)).toBe('StandardChapterEdit');
    expect(new DraftService(course, cms).editPage(true)).toBe('StandardChapterEdit');
  });
});
