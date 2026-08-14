import { expect, test } from '@playwright/test';

import { cloneBlocksStructure } from '../../src/shared/block_structure.js';
import { createContentItem } from '../../src/frontend/stories/components/blocks/block-utils.js';

test.describe('cloneBlocksStructure', () => {
  test('preserves block order, kinds, labels, roles, styles, and visibility', () => {
    const source = cloneBlocksStructure([
      {
        id: 'title-1',
        kind: 'title',
        blockName: 'Heading',
        title: 'Old Title',
        subtitle: 'Old Subtitle',
        coverImage: 'https://example.com/cover.jpg',
        visibility: {
          presenter: true,
          personal: false,
          inNavigation: true,
          hidden: false,
        },
      },
      {
        id: 'content-1',
        kind: 'content',
        blockName: 'Opening',
        displayName: 'Opening Devotion',
        blockRole: 'introduction',
        style: 'secondary',
        content: 'Old content',
        items: [createContentItem('video')],
        visibility: {
          presenter: false,
          personal: true,
          inNavigation: false,
          hidden: false,
        },
        leadersNotes: 'Secret notes',
        showLeadersNotes: true,
      },
      {
        id: 'scripture-1',
        kind: 'scripture',
        blockName: 'Passage',
        displayName: 'Scripture Reading',
        scripture: { reference: 'John 3:16', verse: 'For God so loved...' },
        visibility: {
          presenter: false,
          personal: false,
          inNavigation: false,
          hidden: false,
        },
        leadersNotes: 'More notes',
        showLeadersNotes: true,
      },
    ]);

    expect(source).toHaveLength(3);
    expect(source.map((block) => block.blockName)).toEqual([
      'Heading',
      'Opening',
      'Passage',
    ]);
    expect(source.map((block) => block.kind ?? 'content')).toEqual([
      'title',
      'content',
      'scripture',
    ]);

    const contentBlock = source[1] as Extract<(typeof source)[number], { kind: 'content' }>;
    expect(contentBlock.displayName).toBe('Opening Devotion');
    expect(contentBlock.blockRole).toBe('introduction');
    expect(contentBlock.style).toBe('secondary');
    expect(contentBlock.visibility).toEqual({
      presenter: false,
      personal: true,
      inNavigation: false,
      hidden: false,
    });
    expect(contentBlock.items).toHaveLength(1);
    expect(contentBlock.items[0]?.kind).toBe('video');
  });

  test('clears content fields and assigns fresh ids', () => {
    const originalIds = ['block-a', 'item-a'];
    const cloned = cloneBlocksStructure([
      {
        id: originalIds[0],
        kind: 'content',
        blockName: 'Media',
        displayName: 'Media Block',
        blockRole: 'commentary',
        style: 'primary',
        content: 'Filled content',
        items: [
          {
            id: originalIds[1],
            kind: 'image',
            imageUrl: 'https://example.com/image.jpg',
          },
        ],
        visibility: {
          presenter: false,
          personal: false,
          inNavigation: false,
          hidden: false,
        },
        leadersNotes: 'Notes',
        showLeadersNotes: true,
      },
    ]);

    const block = cloned[0] as Extract<(typeof cloned)[number], { kind: 'content' }>;
    expect(block.id).not.toBe(originalIds[0]);
    expect(block.content).toBe('');
    expect(block.leadersNotes).toBe('');
    expect(block.showLeadersNotes).toBe(false);
    expect(block.items[0]?.id).not.toBe(originalIds[1]);
    expect(block.items[0]?.imageUrl).toBe('');
  });
});
