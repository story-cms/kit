import { expect, test } from '@playwright/test';
import { draftEditPage } from '../../dist/backend/draft_edit_page.js';

test.describe('draftEditPage', () => {
  test('selects the default editor pages', () => {
    expect(draftEditPage('custom-template', false)).toBe('DraftIndex');
    expect(draftEditPage('custom-template', true)).toBe('TranslationIndex');
  });

  test('selects devotion editor pages', () => {
    expect(draftEditPage('devotion', false)).toBe('DevotionDraftEdit');
    expect(draftEditPage('devotion', true)).toBe('DevotionDraftTranslationEdit');
  });

  test('selects course editor pages', () => {
    expect(draftEditPage('course', false)).toBe('CourseDraftEdit');
    expect(draftEditPage('course', true)).toBe('CourseDraftTranslationEdit');
  });

  test('falls back to the default editor for missing templates', () => {
    expect(draftEditPage(undefined, false)).toBe('DraftIndex');
    expect(draftEditPage(null, true)).toBe('TranslationIndex');
  });
});
