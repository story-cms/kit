import { expect, test } from '@playwright/test';
import type { ChapterBlock, StandardChapterBundle } from '../../src/types.js';
import ChapterTranslationService from '../../src/backend/services/chapter_translation_service.js';

function buildTranslationSources(source: StandardChapterBundle) {
  return (
    new ChapterTranslationService() as unknown as {
      buildTranslationSources: (
        bundle: StandardChapterBundle,
      ) => { id: string; text: string }[];
    }
  ).buildTranslationSources(source);
}

const visibility = {
  presenter: false,
  personal: false,
  inNavigation: false,
  hidden: false,
};

function bundle(overrides: Partial<StandardChapterBundle> = {}): StandardChapterBundle {
  return {
    number: '01',
    title: '',
    description: '',
    coverImage: '',
    blocks: [],
    resources: [],
    ...overrides,
  };
}

test.describe('ChapterTranslationService.buildTranslationSources', () => {
  test('includes the bundle title and description when present', () => {
    const sources = buildTranslationSources(
      bundle({ title: 'Chapter title', description: 'Chapter description' }),
    );

    expect(sources).toContainEqual({ id: 'title', text: 'Chapter title' });
    expect(sources).toContainEqual({ id: 'description', text: 'Chapter description' });
  });

  test('omits the bundle title and description when blank or whitespace-only', () => {
    const sources = buildTranslationSources(bundle({ title: '   ', description: '' }));

    expect(sources.some((source) => source.id === 'title')).toBe(false);
    expect(sources.some((source) => source.id === 'description')).toBe(false);
  });

  test("includes a title block's title and subtitle with block-scoped ids", () => {
    const titleBlock: ChapterBlock = {
      id: 'blk-1',
      kind: 'title',
      blockName: 'Title',
      visibility,
      title: 'Block title',
      subtitle: 'Block subtitle',
    };

    const sources = buildTranslationSources(bundle({ blocks: [titleBlock] }));

    expect(sources).toContainEqual({ id: 'block:blk-1:title', text: 'Block title' });
    expect(sources).toContainEqual({ id: 'block:blk-1:subtitle', text: 'Block subtitle' });
  });

  test("omits a title block's subtitle when blank", () => {
    const titleBlock: ChapterBlock = {
      id: 'blk-1',
      kind: 'title',
      blockName: 'Title',
      visibility,
      title: 'Block title',
      subtitle: '',
    };

    const sources = buildTranslationSources(bundle({ blocks: [titleBlock] }));

    expect(sources.some((source) => source.id === 'block:blk-1:subtitle')).toBe(false);
  });

  test("includes a content block's leadersNotes and text items with scoped ids", () => {
    const contentBlock: ChapterBlock = {
      id: 'blk-2',
      kind: 'content',
      blockName: 'Morning',
      visibility,
      displayName: 'Morning',
      blockRole: 'reflection',
      style: 'primary',
      leadersNotes: 'Notes for leaders',
      showLeadersNotes: true,
      items: [{ id: 'item-1', kind: 'text', content: 'Reflection text' }],
    };

    const sources = buildTranslationSources(bundle({ blocks: [contentBlock] }));

    expect(sources).toContainEqual({
      id: 'block:blk-2:leadersNotes',
      text: 'Notes for leaders',
    });
    expect(sources).toContainEqual({
      id: 'block:blk-2:item:item-1',
      text: 'Reflection text',
    });
  });

  test("omits a content block's leadersNotes when blank", () => {
    const contentBlock: ChapterBlock = {
      id: 'blk-2',
      kind: 'content',
      blockName: 'Morning',
      visibility,
      displayName: 'Morning',
      blockRole: 'reflection',
      style: 'primary',
      leadersNotes: '   ',
      showLeadersNotes: false,
      items: [],
    };

    const sources = buildTranslationSources(bundle({ blocks: [contentBlock] }));

    expect(sources.some((source) => source.id === 'block:blk-2:leadersNotes')).toBe(false);
  });

  test('only translates text items, skipping image/video/scripture items', () => {
    const contentBlock: ChapterBlock = {
      id: 'blk-3',
      kind: 'content',
      blockName: 'Evening',
      visibility,
      displayName: 'Evening',
      blockRole: 'application',
      style: 'primary',
      leadersNotes: '',
      showLeadersNotes: false,
      items: [
        { id: 'img-1', kind: 'image', imageUrl: 'https://example.com/pic.jpg' },
        {
          id: 'scr-1',
          kind: 'scripture',
          scripture: { verse: 'In the beginning...', reference: 'Genesis 1:1' },
        },
        { id: 'txt-1', kind: 'text', content: 'Translate me' },
      ],
    };

    const sources = buildTranslationSources(bundle({ blocks: [contentBlock] }));

    expect(sources.some((source) => source.id === 'block:blk-3:item:img-1')).toBe(false);
    expect(sources.some((source) => source.id === 'block:blk-3:item:scr-1')).toBe(false);
    expect(sources).toContainEqual({ id: 'block:blk-3:item:txt-1', text: 'Translate me' });
  });

  test('omits text items with blank content', () => {
    const contentBlock: ChapterBlock = {
      id: 'blk-4',
      kind: 'content',
      blockName: 'Evening',
      visibility,
      displayName: 'Evening',
      blockRole: 'application',
      style: 'primary',
      leadersNotes: '',
      showLeadersNotes: false,
      items: [{ id: 'txt-1', kind: 'text', content: '  ' }],
    };

    const sources = buildTranslationSources(bundle({ blocks: [contentBlock] }));

    expect(sources.some((source) => source.id === 'block:blk-4:item:txt-1')).toBe(false);
  });

  test('combines sources from the bundle and multiple blocks, in order', () => {
    const titleBlock: ChapterBlock = {
      id: 'blk-1',
      kind: 'title',
      blockName: 'Title',
      visibility,
      title: 'Block title',
      subtitle: 'Block subtitle',
    };
    const contentBlock: ChapterBlock = {
      id: 'blk-2',
      kind: 'content',
      blockName: 'Morning',
      visibility,
      displayName: 'Morning',
      blockRole: 'reflection',
      style: 'primary',
      leadersNotes: 'Notes',
      showLeadersNotes: false,
      items: [{ id: 'item-1', kind: 'text', content: 'Body text' }],
    };

    const sources = buildTranslationSources(
      bundle({
        title: 'Chapter title',
        description: 'Chapter description',
        blocks: [titleBlock, contentBlock],
      }),
    );

    expect(sources.map((source) => source.id)).toEqual([
      'title',
      'description',
      'block:blk-1:title',
      'block:blk-1:subtitle',
      'block:blk-2:leadersNotes',
      'block:blk-2:item:item-1',
    ]);
  });
});
