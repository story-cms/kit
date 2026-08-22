import { test, expect } from '@playwright/test';
import {
  standardChapterEditTabHasError,
  firstStandardChapterEditTabWithError,
} from '../../src/frontend/stories/standard-chapter-edit-tab-errors.js';

test.describe('standardChapterEditTabHasError', () => {
  test('flags Details for bundle.title', () => {
    const errors = { 'bundle.title': ['Title is required'] };

    expect(standardChapterEditTabHasError('details', errors)).toBe(true);
    expect(standardChapterEditTabHasError('blocks', errors)).toBe(false);
    expect(standardChapterEditTabHasError('resources', errors)).toBe(false);
  });

  test('flags Blocks for bundle.blocks', () => {
    const errors = { 'bundle.blocks.0.blockName': ['Block name is required'] };

    expect(standardChapterEditTabHasError('details', errors)).toBe(false);
    expect(standardChapterEditTabHasError('blocks', errors)).toBe(true);
    expect(standardChapterEditTabHasError('resources', errors)).toBe(false);
  });

  test('flags Resources for bundle.resources', () => {
    const errors = { 'bundle.resources.0': ['Invalid resource'] };

    expect(standardChapterEditTabHasError('details', errors)).toBe(false);
    expect(standardChapterEditTabHasError('blocks', errors)).toBe(false);
    expect(standardChapterEditTabHasError('resources', errors)).toBe(true);
  });

  test('does not treat bundle.blocksmith as a Blocks error', () => {
    const errors = { 'bundle.blocksmith': ['Unrelated'] };

    expect(standardChapterEditTabHasError('blocks', errors)).toBe(false);
    expect(standardChapterEditTabHasError('details', errors)).toBe(true);
    expect(standardChapterEditTabHasError('resources', errors)).toBe(false);
  });

  test('does not treat bundle.resourcesmith as a Resources error', () => {
    const errors = { 'bundle.resourcesmith': ['Unrelated'] };

    expect(standardChapterEditTabHasError('resources', errors)).toBe(false);
    expect(standardChapterEditTabHasError('details', errors)).toBe(true);
    expect(standardChapterEditTabHasError('blocks', errors)).toBe(false);
  });
});

test.describe('firstStandardChapterEditTabWithError', () => {
  test('returns Details before Blocks when both have errors', () => {
    const errors = {
      'bundle.title': ['Title is required'],
      'bundle.blocks.0.blockName': ['Block name is required'],
    };

    expect(firstStandardChapterEditTabWithError(errors)).toBe('Details');
  });

  test('returns Blocks when only blocks have errors', () => {
    const errors = { 'bundle.blocks.0.blockName': ['Block name is required'] };

    expect(firstStandardChapterEditTabWithError(errors)).toBe('Blocks');
  });

  test('returns null when there are no errors', () => {
    expect(firstStandardChapterEditTabWithError({})).toBeNull();
  });
});
