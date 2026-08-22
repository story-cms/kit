import { expect, test } from '@playwright/test';
import { draftEditPage } from '../../dist/backend/draft_edit_page.js';

test.describe('draftEditPage', () => {
  test('selects the default editor pages', () => {
    expect(draftEditPage('custom-template', false)).toBe('DraftIndex');
    expect(draftEditPage('custom-template', true)).toBe('TranslationIndex');
  });

  test('selects the shared chapter draft editor for devotion and course', () => {
    expect(draftEditPage('devotion', false)).toBe('ChapterDraftEdit');
    expect(draftEditPage('devotion', true)).toBe('ChapterDraftEdit');
    expect(draftEditPage('course', false)).toBe('ChapterDraftEdit');
    expect(draftEditPage('course', true)).toBe('ChapterDraftEdit');
  });

  test('falls back to the default editor for missing templates', () => {
    expect(draftEditPage(undefined, false)).toBe('DraftIndex');
    expect(draftEditPage(null, true)).toBe('TranslationIndex');
  });
});
