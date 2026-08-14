import { expect, test } from '@playwright/test';
import {
  createDevotionDraftBundle,
  normalizeDevotionDraftBundle,
} from '../../src/shared/devotion_draft.js';
import { isDevotionTemplate } from '../../src/shared/story_helpers.js';
import { resourceIds } from '../../src/frontend/stories/components/resource-utils.js';

test.describe('devotion draft helpers', () => {
  test('matches only the exact devotion template identifier', () => {
    expect(isDevotionTemplate('devotion')).toBe(true);
    expect(isDevotionTemplate('Devotion')).toBe(false);
    expect(isDevotionTemplate('devotion ')).toBe(false);
    expect(isDevotionTemplate(undefined)).toBe(false);
  });

  test('creates the canonical empty bundle with a padded draft number', () => {
    expect(createDevotionDraftBundle(1)).toEqual({
      number: '01',
      title: '',
      description: '',
      coverImage: '',
      devotionAudio: { url: null, length: null },
      blocks: [],
      resources: [],
    });
    expect(createDevotionDraftBundle(12).number).toBe('12');
  });

  test('normalizes partial and legacy bundles without discarding content', () => {
    const block = {
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

    expect(
      normalizeDevotionDraftBundle(
        {
          title: 'Existing devotion',
          devotionAudio: '',
          blocks: [block],
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
      blocks: [block],
      resources: ['resource-1'],
    });
  });

  test('normalizes a JSON string and nullable audio metadata', () => {
    expect(
      normalizeDevotionDraftBundle(
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

  test('serializes hydrated editor resources back to persisted IDs', () => {
    expect(
      resourceIds([
        { id: 'resource-2' },
        { id: 'resource-1' },
      ] as Parameters<typeof resourceIds>[0]),
    ).toEqual(['resource-2', 'resource-1']);
  });
});
