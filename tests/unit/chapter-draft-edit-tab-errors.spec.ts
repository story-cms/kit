import { test, expect } from '@playwright/test';
import {
  chapterDraftEditTabHasError,
  firstChapterDraftEditTabWithError,
} from '../../src/frontend/stories/chapter-draft-edit-tab-errors.js';

test.describe('chapterDraftEditTabHasError', () => {
  test('flags Details for bundle.title', () => {
    const errors = { 'bundle.title': ['Title is required'] };

    expect(chapterDraftEditTabHasError('details', errors)).toBe(true);
    expect(chapterDraftEditTabHasError('blocks', errors)).toBe(false);
    expect(chapterDraftEditTabHasError('resources', errors)).toBe(false);
  });

  test('flags Blocks for bundle.blocks', () => {
    const errors = { 'bundle.blocks.0.blockName': ['Block name is required'] };

    expect(chapterDraftEditTabHasError('details', errors)).toBe(false);
    expect(chapterDraftEditTabHasError('blocks', errors)).toBe(true);
    expect(chapterDraftEditTabHasError('resources', errors)).toBe(false);
  });

  test('flags Resources for bundle.resources', () => {
    const errors = { 'bundle.resources.0': ['Invalid resource'] };

    expect(chapterDraftEditTabHasError('details', errors)).toBe(false);
    expect(chapterDraftEditTabHasError('blocks', errors)).toBe(false);
    expect(chapterDraftEditTabHasError('resources', errors)).toBe(true);
  });

  test('does not treat bundle.blocksmith as a Blocks error', () => {
    const errors = { 'bundle.blocksmith': ['Unrelated'] };

    expect(chapterDraftEditTabHasError('blocks', errors)).toBe(false);
    expect(chapterDraftEditTabHasError('details', errors)).toBe(true);
    expect(chapterDraftEditTabHasError('resources', errors)).toBe(false);
  });

  test('does not treat bundle.resourcesmith as a Resources error', () => {
    const errors = { 'bundle.resourcesmith': ['Unrelated'] };

    expect(chapterDraftEditTabHasError('resources', errors)).toBe(false);
    expect(chapterDraftEditTabHasError('details', errors)).toBe(true);
    expect(chapterDraftEditTabHasError('blocks', errors)).toBe(false);
  });
});

test.describe('firstChapterDraftEditTabWithError', () => {
  test('returns Details before Blocks when both have errors', () => {
    const errors = {
      'bundle.title': ['Title is required'],
      'bundle.blocks.0.blockName': ['Block name is required'],
    };

    expect(firstChapterDraftEditTabWithError(errors)).toBe('Details');
  });

  test('returns Blocks when only blocks have errors', () => {
    const errors = { 'bundle.blocks.0.blockName': ['Block name is required'] };

    expect(firstChapterDraftEditTabWithError(errors)).toBe('Blocks');
  });

  test('returns null when there are no errors', () => {
    expect(firstChapterDraftEditTabWithError({})).toBeNull();
  });
});
