import { test, expect } from '@playwright/test';

import {
  blockFieldErrorMessages,
  blockHasError,
  blockItemFieldErrorMessages,
  blockLevelErrorMessages,
  blocksArrayErrorMessages,
} from '../../src/frontend/stories/components/blocks/block-field-errors.js';

test.describe('blockFieldErrorMessages', () => {
  test('reads field-level block errors', () => {
    const errors = {
      'bundle.blocks.0.blockName': ['Every block must have a name'],
      'bundle.blocks.1.title': ['Title is required'],
    };

    expect(blockFieldErrorMessages(errors, 0, 'blockName')).toEqual([
      'Every block must have a name',
    ]);
    expect(blockFieldErrorMessages(errors, 1, 'title')).toEqual(['Title is required']);
    expect(blockFieldErrorMessages(errors, 0, 'title')).toEqual([]);
  });
});

test.describe('blockItemFieldErrorMessages', () => {
  test('reads nested item field errors', () => {
    const errors = {
      'bundle.blocks.0.items.0.imageUrl': ['Invalid image URL'],
    };

    expect(blockItemFieldErrorMessages(errors, 0, 0, 'imageUrl')).toEqual([
      'Invalid image URL',
    ]);
    expect(blockItemFieldErrorMessages(errors, 0, 1, 'imageUrl')).toEqual([]);
  });
});

test.describe('blockHasError', () => {
  test('matches block-level and nested keys', () => {
    const errors = {
      'bundle.blocks.0': [
        'A content block must have text or at least one media or scripture item',
      ],
      'bundle.blocks.1.displayName': ['Display name is required'],
    };

    expect(blockHasError(errors, 0)).toBe(true);
    expect(blockHasError(errors, 1)).toBe(true);
    expect(blockHasError(errors, 2)).toBe(false);
  });
});

test.describe('blockLevelErrorMessages', () => {
  test('reads exact block-level contentOrItem errors', () => {
    const errors = {
      'bundle.blocks.0': [
        'A content block must have text or at least one media or scripture item',
      ],
      'bundle.blocks.0.blockName': ['Every block must have a name'],
    };

    expect(blockLevelErrorMessages(errors, 0)).toEqual([
      'A content block must have text or at least one media or scripture item',
    ]);
  });
});

test.describe('blocksArrayErrorMessages', () => {
  test('reads empty blocks array errors', () => {
    const errors = {
      'bundle.blocks': ['The devotion must have at least one block'],
      'bundle.blocks.minLength': ['The devotion must have at least one block'],
    };

    expect(blocksArrayErrorMessages(errors)).toEqual([
      'The devotion must have at least one block',
      'The devotion must have at least one block',
    ]);
    expect(blocksArrayErrorMessages({})).toEqual([]);
  });
});
