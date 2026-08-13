import { test, expect } from '@playwright/test';
import {
  devotionDraftEditTabHasError,
  firstDevotionDraftEditTabWithError,
} from '../../src/frontend/stories/devotion-draft-edit-tab-errors.js';

test.describe('devotionDraftEditTabHasError', () => {
  test('flags Details for bundle.title', () => {
    const errors = { 'bundle.title': ['Title is required'] };

    expect(devotionDraftEditTabHasError('details', errors)).toBe(true);
    expect(devotionDraftEditTabHasError('blocks', errors)).toBe(false);
    expect(devotionDraftEditTabHasError('resources', errors)).toBe(false);
  });

  test('flags Blocks for bundle.blocks', () => {
    const errors = { 'bundle.blocks.0.blockName': ['Block name is required'] };

    expect(devotionDraftEditTabHasError('details', errors)).toBe(false);
    expect(devotionDraftEditTabHasError('blocks', errors)).toBe(true);
    expect(devotionDraftEditTabHasError('resources', errors)).toBe(false);
  });

  test('flags Resources for bundle.resources', () => {
    const errors = { 'bundle.resources.0': ['Invalid resource'] };

    expect(devotionDraftEditTabHasError('details', errors)).toBe(false);
    expect(devotionDraftEditTabHasError('blocks', errors)).toBe(false);
    expect(devotionDraftEditTabHasError('resources', errors)).toBe(true);
  });

  test('does not treat bundle.blocksmith as a Blocks error', () => {
    const errors = { 'bundle.blocksmith': ['Unrelated'] };

    expect(devotionDraftEditTabHasError('blocks', errors)).toBe(false);
    expect(devotionDraftEditTabHasError('details', errors)).toBe(true);
    expect(devotionDraftEditTabHasError('resources', errors)).toBe(false);
  });

  test('does not treat bundle.resourcesmith as a Resources error', () => {
    const errors = { 'bundle.resourcesmith': ['Unrelated'] };

    expect(devotionDraftEditTabHasError('resources', errors)).toBe(false);
    expect(devotionDraftEditTabHasError('details', errors)).toBe(true);
    expect(devotionDraftEditTabHasError('blocks', errors)).toBe(false);
  });
});

test.describe('firstDevotionDraftEditTabWithError', () => {
  test('returns Details before Blocks when both have errors', () => {
    const errors = {
      'bundle.title': ['Title is required'],
      'bundle.blocks.0.blockName': ['Block name is required'],
    };

    expect(firstDevotionDraftEditTabWithError(errors)).toBe('Details');
  });

  test('returns Blocks when only blocks have errors', () => {
    const errors = { 'bundle.blocks.0.blockName': ['Block name is required'] };

    expect(firstDevotionDraftEditTabWithError(errors)).toBe('Blocks');
  });

  test('returns null when there are no errors', () => {
    expect(firstDevotionDraftEditTabWithError({})).toBeNull();
  });
});
