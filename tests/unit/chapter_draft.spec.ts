import { expect, test } from '@playwright/test';
import {
  chapterDraftTemplate,
  createChapterDraftBundle,
  isChapterDraftTemplate,
  normalizedChapterDraftBundle,
  translationChapterDraftBundle,
} from '../../src/shared/chapter_draft.js';
import { isCourseTemplate, isDevotionTemplate } from '../../src/shared/story_helpers.js';
import { resourceIds } from '../../src/frontend/stories/components/resource-utils.js';

const titleBlock = {
  id: 'block-1',
  kind: 'title' as const,
  blockName: 'Heading',
  title: 'Welcome',
  subtitle: '',
  visibility: {
    presenter: true,
    personal: false,
    inNavigation: true,
    hidden: false,
  },
};

test.describe('chapter draft templates', () => {
  test('recognises only registered chapter draft templates', () => {
    expect(isChapterDraftTemplate('course')).toBe(true);
    expect(isChapterDraftTemplate('devotion')).toBe(true);
    expect(isChapterDraftTemplate('Course')).toBe(false);
    expect(isChapterDraftTemplate('custom-template')).toBe(false);
    expect(isChapterDraftTemplate(undefined)).toBe(false);
  });

  test('describes scripture and extra fields per template', () => {
    expect(chapterDraftTemplate('course')?.includeScriptureBlock).toBe(false);
    expect(chapterDraftTemplate('course')?.extraFields).toEqual([]);
    expect(chapterDraftTemplate('devotion')?.includeScriptureBlock).toBe(true);
    expect(chapterDraftTemplate('devotion')?.extraFields).toEqual(['devotionAudio']);
  });

  test('matches only the exact course and devotion identifiers', () => {
    expect(isCourseTemplate('course')).toBe(true);
    expect(isCourseTemplate('Course')).toBe(false);
    expect(isDevotionTemplate('devotion')).toBe(true);
    expect(isDevotionTemplate('devotion ')).toBe(false);
  });
});

test.describe('createChapterDraftBundle', () => {
  test('creates a course bundle without extra fields', () => {
    expect(createChapterDraftBundle('course', 1)).toEqual({
      number: '01',
      title: '',
      description: '',
      coverImage: '',
      blocks: [],
      resources: [],
    });
    expect(createChapterDraftBundle('course', 12).number).toBe('12');
  });

  test('creates a devotion bundle with empty audio', () => {
    expect(createChapterDraftBundle('devotion', 1)).toEqual({
      number: '01',
      title: '',
      description: '',
      coverImage: '',
      devotionAudio: { url: null, length: null },
      blocks: [],
      resources: [],
    });
    expect(createChapterDraftBundle('devotion', 12).number).toBe('12');
  });
});

test.describe('normalizedChapterDraftBundle', () => {
  test('normalizes a partial course bundle without discarding content', () => {
    expect(
      normalizedChapterDraftBundle(
        'course',
        {
          title: 'Existing session',
          blocks: [titleBlock],
          resources: ['resource-1', null, 2],
        },
        3,
      ),
    ).toEqual({
      number: '03',
      title: 'Existing session',
      description: '',
      coverImage: '',
      blocks: [titleBlock],
      resources: ['resource-1'],
    });
  });

  test('normalizes a JSON string course bundle', () => {
    expect(
      normalizedChapterDraftBundle(
        'course',
        JSON.stringify({
          number: '07',
          title: 'Session seven',
        }),
        1,
      ),
    ).toMatchObject({
      number: '07',
      title: 'Session seven',
    });
  });

  test('normalizes a partial devotion bundle and legacy audio', () => {
    expect(
      normalizedChapterDraftBundle(
        'devotion',
        {
          title: 'Existing devotion',
          devotionAudio: '',
          blocks: [titleBlock],
          resources: ['resource-1', null, 2],
        },
        3,
      ),
    ).toEqual({
      number: '03',
      title: 'Existing devotion',
      description: '',
      coverImage: '',
      devotionAudio: { url: null, length: null },
      blocks: [titleBlock],
      resources: ['resource-1'],
    });
  });

  test('normalizes a JSON string and nullable audio metadata', () => {
    expect(
      normalizedChapterDraftBundle(
        'devotion',
        JSON.stringify({
          number: '07',
          devotionAudio: { url: 'https://example.com/audio.mp3', length: 120 },
        }),
        1,
      ),
    ).toMatchObject({
      number: '07',
      devotionAudio: { url: 'https://example.com/audio.mp3', length: 120 },
    });
  });
});

test.describe('translationChapterDraftBundle', () => {
  test('keeps cover image and block structure, clears locale-specific content', () => {
    const source = normalizedChapterDraftBundle(
      'devotion',
      {
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
      },
      1,
    );

    const translated = translationChapterDraftBundle('devotion', source);

    expect(translated.title).toBe('');
    expect(translated.description).toBe('');
    expect(translated.coverImage).toBe('https://example.com/cover.jpg');
    expect(translated.devotionAudio).toEqual({ url: null, length: null });
    expect(translated.resources).toEqual([]);
    expect(translated.blocks).toHaveLength(1);
    expect(translated.blocks[0]?.kind).toBe('content');
    expect(translated.blocks[0]?.blockRole).toBe('introduction');
    expect(translated.blocks[0]?.blockName).toBe('');
    expect(translated.blocks[0]?.id).not.toBe('block-1');
  });
});

test.describe('resourceIds', () => {
  test('serializes hydrated editor resources back to persisted IDs', () => {
    expect(
      resourceIds([
        { id: 'resource-2' },
        { id: 'resource-1' },
      ] as Parameters<typeof resourceIds>[0]),
    ).toEqual(['resource-2', 'resource-1']);
  });
});
