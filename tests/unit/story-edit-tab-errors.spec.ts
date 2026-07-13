import { test, expect } from '@playwright/test';
import {
  firstStoryEditTabWithError,
  storyEditTabHasError,
} from '../../src/frontend/stories/story-edit-tab-errors.js';

test.describe('storyEditTabHasError', () => {
  test('flags Details for bundle.title', () => {
    const errors = { 'bundle.title': ['Title is required'] };

    expect(storyEditTabHasError('details', errors)).toBe(true);
    expect(storyEditTabHasError('sections', errors)).toBe(false);
    expect(storyEditTabHasError('resources', errors)).toBe(false);
  });

  test('flags Sections for bundle.sections.N.title', () => {
    const errors = { 'bundle.sections.1.title': ['Title is required'] };

    expect(storyEditTabHasError('details', errors)).toBe(false);
    expect(storyEditTabHasError('sections', errors)).toBe(true);
    expect(storyEditTabHasError('resources', errors)).toBe(false);
  });

  test('flags Resources for bundle.resources', () => {
    const errors = { 'bundle.resources.0': ['Invalid resource'] };

    expect(storyEditTabHasError('details', errors)).toBe(false);
    expect(storyEditTabHasError('sections', errors)).toBe(false);
    expect(storyEditTabHasError('resources', errors)).toBe(true);
  });
});

test.describe('firstStoryEditTabWithError', () => {
  test('returns Details before Sections when both have errors', () => {
    const errors = {
      'bundle.title': ['Title is required'],
      'bundle.sections.0.title': ['Section title is required'],
    };

    expect(firstStoryEditTabWithError(errors, 'Chapters')).toBe('Details');
  });

  test('returns dynamic section tab label when only sections have errors', () => {
    const errors = { 'bundle.sections.0.title': ['Section title is required'] };

    expect(firstStoryEditTabWithError(errors, 'Chapters')).toBe('Chapters');
  });

  test('returns null when there are no errors', () => {
    expect(firstStoryEditTabWithError({}, 'Chapters')).toBeNull();
  });
});
