import { expect, test } from '@playwright/test';

import { resolvePreviewBundle } from '../../src/shared/preview_bundle.js';

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

test.describe('resolvePreviewBundle', () => {
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

    const result = resolvePreviewBundle({
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

    const result = resolvePreviewBundle({
      chapter: { bundle: { blocks: chapterBlocks }, number: 2 },
      draft: null,
      template: 'devotion',
    });

    expect(
      (result.blocks as Array<{ blockName: string }>).map((block) => block.blockName),
    ).toEqual(['Block-A', 'Block-B']);
  });

  test('returns parsed chapter bundle for non-devotion templates', () => {
    const chapterBundle = { title: 'Course chapter', screens: [{ screenName: 'Intro' }] };

    const result = resolvePreviewBundle({
      chapter: { bundle: chapterBundle, number: 1 },
      draft: { bundle: { title: 'Draft title' }, number: 1 },
      template: 'course',
    });

    expect(result.title).toBe('Draft title');
  });
});
