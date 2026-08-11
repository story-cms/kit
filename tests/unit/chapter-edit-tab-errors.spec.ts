import { test, expect } from '@playwright/test';
import {
  chapterEditTabHasError,
  firstChapterEditTabWithError,
} from '../../src/frontend/stories/chapter-edit-tab-errors.js';

test.describe('chapterEditTabHasError', () => {
  test('flags Details for bundle.title', () => {
    const errors = { 'bundle.title': ['Title is required'] };

    expect(chapterEditTabHasError('details', errors)).toBe(true);
    expect(chapterEditTabHasError('blocks', errors)).toBe(false);
    expect(chapterEditTabHasError('resources', errors)).toBe(false);
  });

  test('flags Blocks for bundle.blocks', () => {
    const errors = { 'bundle.blocks.0.blockName': ['Block name is required'] };

    expect(chapterEditTabHasError('details', errors)).toBe(false);
    expect(chapterEditTabHasError('blocks', errors)).toBe(true);
    expect(chapterEditTabHasError('resources', errors)).toBe(false);
  });

  test('flags Resources for bundle.resources', () => {
    const errors = { 'bundle.resources.0': ['Invalid resource'] };

    expect(chapterEditTabHasError('details', errors)).toBe(false);
    expect(chapterEditTabHasError('blocks', errors)).toBe(false);
    expect(chapterEditTabHasError('resources', errors)).toBe(true);
  });

  test('does not treat bundle.blocksmith as a Blocks error', () => {
    const errors = { 'bundle.blocksmith': ['Unrelated'] };

    expect(chapterEditTabHasError('blocks', errors)).toBe(false);
    expect(chapterEditTabHasError('details', errors)).toBe(true);
    expect(chapterEditTabHasError('resources', errors)).toBe(false);
  });

  test('does not treat bundle.resourcesmith as a Resources error', () => {
    const errors = { 'bundle.resourcesmith': ['Unrelated'] };

    expect(chapterEditTabHasError('resources', errors)).toBe(false);
    expect(chapterEditTabHasError('details', errors)).toBe(true);
    expect(chapterEditTabHasError('blocks', errors)).toBe(false);
  });
});

test.describe('firstChapterEditTabWithError', () => {
  test('returns Details before Blocks when both have errors', () => {
    const errors = {
      'bundle.title': ['Title is required'],
      'bundle.blocks.0.blockName': ['Block name is required'],
    };

    expect(firstChapterEditTabWithError(errors)).toBe('Details');
  });

  test('returns Blocks when only blocks have errors', () => {
    const errors = { 'bundle.blocks.0.blockName': ['Block name is required'] };

    expect(firstChapterEditTabWithError(errors)).toBe('Blocks');
  });

  test('returns null when there are no errors', () => {
    expect(firstChapterEditTabWithError({})).toBeNull();
  });
});
