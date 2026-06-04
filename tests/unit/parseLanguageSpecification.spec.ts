import { test, expect } from '@playwright/test';

import { parseLanguageSpecification } from '../../src/frontend/shared/helpers';
import type { LanguageSpecification } from '../../src/types';

test.describe('parseLanguageSpecification', () => {
  test('returns display name and native name as language when no separator', () => {
    const spec: LanguageSpecification = {
      locale: 'en',
      language: 'English',
      languageDirection: 'ltr',
    };

    expect(parseLanguageSpecification(spec)).toEqual({
      name: 'English',
      nativeName: 'English',
      locale: 'en',
    });
  });

  test('splits pipe-separated language into display name and native name', () => {
    const spec: LanguageSpecification = {
      locale: 'en',
      language: 'English | American',
      languageDirection: 'ltr',
    };

    expect(parseLanguageSpecification(spec)).toEqual({
      name: 'English',
      nativeName: 'American',
      locale: 'en',
    });
  });

  test('trims whitespace around pipe-separated parts', () => {
    const spec: LanguageSpecification = {
      locale: 'en',
      language: '  English  |  American  ',
      languageDirection: 'ltr',
    };

    expect(parseLanguageSpecification(spec)).toEqual({
      name: 'English',
      nativeName: 'American',
      locale: 'en',
    });
  });

  test('splits dash-separated language into display name and native name', () => {
    const spec: LanguageSpecification = {
      locale: 'es',
      language: 'Spanish - Español',
      languageDirection: 'ltr',
    };

    expect(parseLanguageSpecification(spec)).toEqual({
      name: 'Spanish',
      nativeName: 'Español',
      locale: 'es',
    });
  });

  test('trims whitespace around dash-separated parts', () => {
    const spec: LanguageSpecification = {
      locale: 'de',
      language: '  German  -  Deutsch  ',
      languageDirection: 'ltr',
    };

    expect(parseLanguageSpecification(spec)).toEqual({
      name: 'German',
      nativeName: 'Deutsch',
      locale: 'de',
    });
  });
});
