import { expect, test } from '@playwright/test';
import vine from '@vinejs/vine';
import { DevotionDraftValidator } from '../../src/backend/validators/devotion_draft.js';

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

const validData = () => ({
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

async function validationFields(data: unknown): Promise<string[]> {
  try {
    await new DevotionDraftValidator().validate(data);
    return [];
  } catch (error) {
    return ((error as ValidationError).messages ?? []).map((message) => message.field);
  }
}

test.describe('DevotionDraftValidator', () => {
  test.beforeEach(() => {
    vine.convertEmptyStringsToNull = false;
  });

  test('accepts valid mixed blocks and optional fields', async () => {
    const result = await new DevotionDraftValidator().validate(validData());

    expect(result.bundle.blocks).toHaveLength(3);
    expect(result.bundle.devotionAudio).toEqual({ url: null, length: null });
  });

  test('accepts a valid bundle when optional fields are omitted', async () => {
    const data: any = validData();
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

    await expect(new DevotionDraftValidator().validate(data)).resolves.toBeDefined();
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
    const data = validData();
    data.bundle.blocks = itemBlocks;

    await expect(new DevotionDraftValidator().validate(data)).resolves.toBeDefined();
  });

  test('accepts content text without an items property', async () => {
    const withoutItems: Partial<ReturnType<typeof contentBlock>> = {
      ...contentBlock(),
    };
    delete withoutItems.items;
    const data = validData();
    data.bundle.blocks = [withoutItems] as typeof data.bundle.blocks;

    await expect(new DevotionDraftValidator().validate(data)).resolves.toBeDefined();
  });

  test('requires number, title, and at least one block', async () => {
    const data = validData();
    data.bundle.number = '';
    data.bundle.title = '';
    data.bundle.blocks = [];

    expect(await validationFields(data)).toEqual(
      expect.arrayContaining(['bundle.number', 'bundle.title', 'bundle.blocks']),
    );
  });

  test('requires the shared fields on every block', async () => {
    const data = validData();
    data.bundle.blocks = [
      {
        ...contentBlock(),
        id: '',
        blockName: '',
        visibility: undefined as never,
      },
    ];

    expect(await validationFields(data)).toEqual(
      expect.arrayContaining([
        'bundle.blocks.0.id',
        'bundle.blocks.0.blockName',
        'bundle.blocks.0.visibility',
      ]),
    );
  });

  test('requires complete content, title, and scripture block details', async () => {
    const data = validData();
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

    expect(await validationFields(data)).toEqual(
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
    const data = validData();
    data.bundle.resources = ['not-a-resource-id'];
    data.bundle.blocks = [
      {
        ...contentBlock(),
        content: '',
        items: [{ id: 'image-1', kind: 'image', imageUrl: 'not-a-url' }],
      },
    ];

    expect(await validationFields(data)).toEqual(
      expect.arrayContaining([
        'bundle.resources.0',
        'bundle.blocks.0.items.0.imageUrl',
      ]),
    );
  });
});
