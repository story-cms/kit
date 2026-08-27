import { expect, test } from '@playwright/test';

import { previewBundleFrom } from '../../src/shared/preview_bundle.js';

const contentBlock = (blockName: string) => ({
  id: blockName,
  kind: 'content' as const,
  blockName,
  displayName: blockName,
  blockRole: 'introduction',
  style: 'primary',
  content: `Content for ${blockName}`,
  items: [],
  visibility: {
    presenter: false,
    personal: false,
    inNavigation: false,
    hidden: false,
  },
  leadersNotes: '',
  showLeadersNotes: false,
});

test.describe('previewBundleFrom', () => {
  test('prefers draft block order over published chapter for devotion', () => {
    const chapterBlocks = [
      contentBlock('Block-A'),
      contentBlock('Block-B'),
      contentBlock('Block-C'),
    ];
    const draftBlocks = [
      contentBlock('Block-C'),
      contentBlock('Block-A'),
      contentBlock('Block-B'),
    ];

    const result = previewBundleFrom({
      chapter: { bundle: { blocks: chapterBlocks }, number: 1 },
      draft: { bundle: { blocks: draftBlocks }, number: 1 },
      template: 'devotion',
    });

    expect(result.blocks).toHaveLength(3);
    expect(
      (result.blocks as Array<{ blockName: string }>).map((block) => block.blockName),
    ).toEqual(['Block-C', 'Block-A', 'Block-B']);
  });

  test('uses chapter bundle when no draft exists', () => {
    const chapterBlocks = [
      contentBlock('Block-A'),
      contentBlock('Block-B'),
    ];

    const result = previewBundleFrom({
      chapter: { bundle: { blocks: chapterBlocks }, number: 2 },
      draft: null,
      template: 'devotion',
    });

    expect(
      (result.blocks as Array<{ blockName: string }>).map((block) => block.blockName),
    ).toEqual(['Block-A', 'Block-B']);
  });

  test('normalizes course template bundles with block order from draft', () => {
    const chapterBlocks = [
      contentBlock('Block-A'),
      contentBlock('Block-B'),
    ];
    const draftBlocks = [
      contentBlock('Block-B'),
      contentBlock('Block-A'),
    ];

    const result = previewBundleFrom({
      chapter: { bundle: { blocks: chapterBlocks }, number: 1 },
      draft: { bundle: { blocks: draftBlocks }, number: 1 },
      template: 'course',
    });

    expect(result.blocks).toHaveLength(2);
    expect(
      (result.blocks as Array<{ blockName: string }>).map((block) => block.blockName),
    ).toEqual(['Block-B', 'Block-A']);
  });
});
