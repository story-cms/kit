import { test, expect } from '@playwright/test';

import { languages } from '../../src/frontend/settings/languages/languages';
import { isValidLanguageTag } from '../../src/shared/language_helpers';

test.describe('isValidLanguageTag', () => {
  test('accepts short and extended BCP 47 tags', () => {
    expect(isValidLanguageTag('en')).toBe(true);
    expect(isValidLanguageTag('zh')).toBe(true);
    expect(isValidLanguageTag('zh-Hans')).toBe(true);
    expect(isValidLanguageTag('en-US')).toBe(true);
  });

  test('rejects underscore-style tags and empty string', () => {
    expect(isValidLanguageTag('zh_Hans')).toBe(false);
    expect(isValidLanguageTag('zh_CN')).toBe(false);
    expect(isValidLanguageTag('')).toBe(false);
  });

  // Kit language picker defaults — syntax only, not per-client config.languages.
  test('kit language catalog locales are valid BCP 47 tags', () => {
    for (const { locale } of languages) {
      expect(isValidLanguageTag(locale), `invalid locale: ${locale}`).toBe(true);
    }
  });
});
