import { test, expect } from '@playwright/test';

import { languageMatches } from '../../src/frontend/shared/helpers';

test.describe('languageMatches', () => {
  test('exact match when stored is base name only', () => {
    expect(languageMatches('Bengali', 'Bengali')).toBe(true);
    expect(languageMatches('English', 'English')).toBe(true);
  });

  test('match stored format with native script to API base name', () => {
    expect(languageMatches('Bengali - বাংলা', 'Bengali')).toBe(true);
    expect(languageMatches('Arabic - عربى', 'Arabic')).toBe(true);
    expect(languageMatches('English - English', 'English')).toBe(true);
  });

  test('match stored format with pipe separator (e.g. source language)', () => {
    expect(languageMatches('English | American', 'English')).toBe(true);
    expect(languageMatches('English | American', 'English, American Standard')).toBe(true);
  });

  test('match stored format to API dialect with comma', () => {
    expect(languageMatches('Arabic - عربى', 'Arabic, Sudanese Creole')).toBe(true);
  });

  test('match stored format to API variant with space', () => {
    expect(languageMatches('Arabic - عربى', 'Arabic Standard')).toBe(true);
    expect(languageMatches('English - English', 'English, US')).toBe(true);
  });

  test('reject non-matching languages', () => {
    expect(languageMatches('Bengali - বাংলা', 'Arabic')).toBe(false);
    expect(languageMatches('Arabic - عربى', 'Bengali')).toBe(false);
    expect(languageMatches('English', 'French')).toBe(false);
  });

  test('reject partial prefix match to avoid false positives', () => {
    expect(languageMatches('Arab - test', 'Arabic')).toBe(false);
    expect(languageMatches('Eng - test', 'English')).toBe(false);
  });
});
