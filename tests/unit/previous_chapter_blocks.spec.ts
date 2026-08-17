import { expect, test } from '@playwright/test';

import { previousDevotionChapterBlocks } from '../../src/shared/previous_chapter_blocks.js';

test.describe('previousDevotionChapterBlocks', () => {
  test('returns empty array for the first chapter', async () => {
    let called = false;
    const loadBundle = async () => {
      called = true;
      return null;
    };

    await expect(
      previousDevotionChapterBlocks(
        { apiVersion: 1, locale: 'en', storyId: 1, number: 1 },
        loadBundle,
      ),
    ).resolves.toEqual([]);
    expect(called).toBe(false);
  });

  test('loads blocks from the immediately previous chapter', async () => {
    const loadBundle = async (spec: { number: number }) => {
      if (spec.number === 2) {
        return {
          blocks: [
            {
              id: 'block-2',
              kind: 'content',
              blockName: 'Second',
            },
          ],
        };
      }

      return {
        blocks: [
          {
            id: 'block-1',
            kind: 'content',
            blockName: 'First',
            blockRole: 'introduction',
            style: 'primary',
            displayName: 'Intro',
            content: 'Hello',
            items: [],
            visibility: {
              presenter: false,
              personal: false,
              inNavigation: false,
              hidden: false,
            },
          },
        ],
      };
    };

    const blocks = await previousDevotionChapterBlocks(
      { apiVersion: 1, locale: 'en', storyId: 1, number: 2 },
      loadBundle,
    );

    expect(blocks).toHaveLength(1);
    expect(blocks[0]?.blockName).toBe('First');
  });
});
