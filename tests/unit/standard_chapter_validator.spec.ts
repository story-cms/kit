import { expect, test } from '@playwright/test';
import vine from '@vinejs/vine';
import {
  StandardChapterValidator,
  standardChapterValidator,
} from '../../src/backend/validators/standard_chapter.js';
import { COURSE_TEMPLATE_ID, DEVOTION_TEMPLATE_ID } from '../../src/shared/story_helpers.js';

const visibility = {
  presenter: true,
  personal: false,
  inNavigation: true,
  hidden: false,
};

const contentBlock = () => ({
  id: 'content-1',
  kind: 'content',
  blockName: 'Introduction',
  visibility,
  displayName: 'Welcome',
  blockRole: 'introduction',
  style: 'primary',
  content: 'A short introduction.',
  items: [],
  leadersNotes: '',
  showLeadersNotes: false,
});

const titleBlock = () => ({
  id: 'title-1',
  kind: 'title',
  blockName: 'Title',
  visibility,
  title: 'God is faithful',
  subtitle: '',
  coverImage: '',
});

const scriptureBlock = () => ({
  id: 'scripture-1',
  kind: 'scripture',
  blockName: 'Scripture',
  visibility,
  displayName: 'Read the passage',
  scripture: { reference: 'John 3:16', verse: 'For God so loved the world.' },
  leadersNotes: '',
  showLeadersNotes: false,
});

const validCourseBundle = () => ({
  bundle: {
    number: '01',
    title: 'Introduction to Alongsiding',
    description: 'Opening session',
    coverImage: '',
    blocks: [contentBlock(), titleBlock()],
    resources: [],
  },
});

const validDevotionBundle = () => ({
  bundle: {
    number: '01',
    title: 'Morning devotion',
    description: '',
    coverImage: '',
    devotionAudio: { url: null, length: null },
    blocks: [contentBlock(), titleBlock(), scriptureBlock()],
    resources: ['00000000-0000-4000-8000-000000000001'],
  },
});

type ValidationError = {
  messages?: Array<{ message: string; rule: string; field: string }>;
};

async function validationErrors(
  validator: StandardChapterValidator,
  data: unknown,
): Promise<Array<{ message: string; field: string }>> {
  try {
    await validator.validate(data);
    return [];
  } catch (error) {
    return ((error as ValidationError).messages ?? []).map((message) => ({
      message: message.message,
      field: message.field,
    }));
  }
}

async function validationFields(
  validator: StandardChapterValidator,
  data: unknown,
): Promise<string[]> {
  return (await validationErrors(validator, data)).map((error) => error.field);
}

test.describe('StandardChapterValidator', () => {
  test.beforeEach(() => {
    vine.convertEmptyStringsToNull = false;
  });

  test('returns a validator for standard chapter templates only', () => {
    expect(
      standardChapterValidator({ template: COURSE_TEMPLATE_ID, chapterType: 'Session' }),
    ).toBeInstanceOf(StandardChapterValidator);
    expect(
      standardChapterValidator({ template: DEVOTION_TEMPLATE_ID, chapterType: 'Day' }),
    ).toBeInstanceOf(StandardChapterValidator);
    expect(standardChapterValidator({ template: 'stations' })).toBeUndefined();
  });

  test('uses the chapter type in required-field messages', async () => {
    const validator = new StandardChapterValidator(COURSE_TEMPLATE_ID, 'Session');
    const errors = await validationErrors(validator, {
      bundle: {
        ...validCourseBundle().bundle,
        number: '',
        title: '',
        blocks: [],
      },
    });

    expect(errors.map((error) => error.message)).toEqual(
      expect.arrayContaining([
        'The session must have a number',
        'The session must have a title',
        'The session must have at least one block',
      ]),
    );
  });

  test.describe('course template', () => {
    const validator = () => new StandardChapterValidator(COURSE_TEMPLATE_ID, 'Session');

    test('accepts a valid block-based bundle', async () => {
      const result = await validator().validate(validCourseBundle());

      expect(result.bundle.title).toBe('Introduction to Alongsiding');
      expect(result.bundle.blocks).toHaveLength(2);
      expect(result.bundle.devotionAudio).toBeUndefined();
    });

    test('accepts a bundle with a cover image', async () => {
      const result = await validator().validate({
        bundle: {
          ...validCourseBundle().bundle,
          coverImage: 'https://example.com/cover.png',
        },
      });

      expect(result.bundle.coverImage).toBe('https://example.com/cover.png');
    });

    test('rejects a scripture block kind with a friendly message', async () => {
      const errors = await validationErrors(validator(), {
        bundle: {
          ...validCourseBundle().bundle,
          blocks: [contentBlock(), scriptureBlock()],
        },
      });

      expect(errors.map((error) => error.message)).toEqual(
        expect.arrayContaining([
          "This block type isn't supported for this chapter template",
        ]),
      );
    });

    test('requires at least one block', async () => {
      await expect(
        validator().validate({
          bundle: {
            ...validCourseBundle().bundle,
            blocks: [],
          },
        }),
      ).rejects.toBeDefined();
    });
  });

  test.describe('devotion template', () => {
    const validator = () => new StandardChapterValidator(DEVOTION_TEMPLATE_ID, 'Devotion');

    test('accepts valid mixed blocks and optional fields', async () => {
      const result = await validator().validate(validDevotionBundle());

      expect(result.bundle.blocks).toHaveLength(3);
      expect(result.bundle.devotionAudio).toEqual({ url: null, length: null });
    });

    test('accepts a valid bundle when optional fields are omitted', async () => {
      const data: any = validDevotionBundle();
      delete data.bundle.description;
      delete data.bundle.coverImage;
      delete data.bundle.devotionAudio;
      delete data.bundle.resources;
      delete data.bundle.blocks[0].leadersNotes;
      delete data.bundle.blocks[0].showLeadersNotes;
      delete data.bundle.blocks[1].subtitle;
      delete data.bundle.blocks[1].coverImage;
      delete data.bundle.blocks[2].leadersNotes;
      delete data.bundle.blocks[2].showLeadersNotes;

      await expect(validator().validate(data)).resolves.toBeDefined();
    });

    test('accepts content supplied by a valid image, video, or scripture item', async () => {
      const itemBlocks = [
        { id: 'image-1', kind: 'image', imageUrl: 'https://example.com/image.jpg' },
        { id: 'video-1', kind: 'video', video: { url: 'https://example.com/video.mp4' } },
        {
          id: 'verse-1',
          kind: 'scripture',
          scripture: { reference: 'Psalm 23:1', verse: 'The Lord is my shepherd.' },
        },
      ].map((item, index) => ({
        ...contentBlock(),
        id: `content-${index}`,
        content: '',
        items: [item],
      }));
      const data = validDevotionBundle();
      data.bundle.blocks = itemBlocks;

      await expect(validator().validate(data)).resolves.toBeDefined();
    });

    test('accepts content text without an items property', async () => {
      const withoutItems: Partial<ReturnType<typeof contentBlock>> = {
        ...contentBlock(),
      };
      delete withoutItems.items;
      const data = validDevotionBundle();
      data.bundle.blocks = [withoutItems] as typeof data.bundle.blocks;

      await expect(validator().validate(data)).resolves.toBeDefined();
    });

    test('requires number, title, and at least one block', async () => {
      const data = validDevotionBundle();
      data.bundle.number = '';
      data.bundle.title = '';
      data.bundle.blocks = [];

      expect(await validationFields(validator(), data)).toEqual(
        expect.arrayContaining(['bundle.number', 'bundle.title', 'bundle.blocks']),
      );
    });

    test('requires the shared fields on every block', async () => {
      const data = validDevotionBundle();
      data.bundle.blocks = [
        {
          ...contentBlock(),
          id: '',
          blockName: '',
          visibility: undefined as never,
        },
      ];

      expect(await validationFields(validator(), data)).toEqual(
        expect.arrayContaining([
          'bundle.blocks.0.id',
          'bundle.blocks.0.blockName',
          'bundle.blocks.0.visibility',
        ]),
      );
    });

    test('requires complete content, title, and scripture block details', async () => {
      const data = validDevotionBundle();
      data.bundle.blocks = [
        {
          ...contentBlock(),
          displayName: '',
          blockRole: '',
          style: '',
          content: '',
          items: [],
        },
        { ...titleBlock(), title: '' },
        {
          ...scriptureBlock(),
          displayName: '',
          scripture: { reference: '', verse: '' },
        },
      ];

      expect(await validationFields(validator(), data)).toEqual(
        expect.arrayContaining([
          'bundle.blocks.0.displayName',
          'bundle.blocks.0.blockRole',
          'bundle.blocks.0.style',
          'bundle.blocks.0',
          'bundle.blocks.1.title',
          'bundle.blocks.2.displayName',
          'bundle.blocks.2.scripture.reference',
          'bundle.blocks.2.scripture.verse',
        ]),
      );
    });

    test('rejects invalid resource and media values with nested paths', async () => {
      const data = validDevotionBundle();
      data.bundle.resources = ['not-a-resource-id'];
      data.bundle.blocks = [
        {
          ...contentBlock(),
          content: '',
          items: [{ id: 'image-1', kind: 'image', imageUrl: 'not-a-url' }],
        },
      ];

      expect(await validationFields(validator(), data)).toEqual(
        expect.arrayContaining(['bundle.resources.0', 'bundle.blocks.0.items.0.imageUrl']),
      );
    });
  });
});
