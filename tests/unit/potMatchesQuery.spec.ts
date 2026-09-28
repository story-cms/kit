import { test, expect } from '@playwright/test';

import { potMatchesQuery } from '../../src/frontend/settings/tokens/tokens';
import type { TokenPot } from '../../src/types';

const spanish: TokenPot = { locale: 'es', name: 'Spanish', allocated: 4500, used: 3200 };
const english: TokenPot = { locale: 'en', name: 'English', allocated: 5000, used: 4200 };

test.describe('potMatchesQuery', () => {
  test('matches full language name, case-insensitive', () => {
    expect(potMatchesQuery(spanish, 'Spanish')).toBe(true);
    expect(potMatchesQuery(spanish, 'spanish')).toBe(true);
    expect(potMatchesQuery(spanish, 'SPANISH')).toBe(true);
  });

  test('matches partial language name substring, case-insensitive', () => {
    expect(potMatchesQuery(spanish, 'span')).toBe(true);
    expect(potMatchesQuery(english, 'ENG')).toBe(true);
  });

  test('matches full locale code, case-insensitive', () => {
    expect(potMatchesQuery(spanish, 'es')).toBe(true);
    expect(potMatchesQuery(spanish, 'ES')).toBe(true);
  });

  test('matches partial locale code substring', () => {
    expect(potMatchesQuery(english, 'n')).toBe(true);
  });

  test('returns false when neither name nor locale matches', () => {
    expect(potMatchesQuery(spanish, 'french')).toBe(false);
    expect(potMatchesQuery(spanish, 'fr')).toBe(false);
  });

  test('empty or whitespace-only query matches everything', () => {
    expect(potMatchesQuery(spanish, '')).toBe(true);
    expect(potMatchesQuery(spanish, '   ')).toBe(true);
  });

  test('trims surrounding whitespace before matching', () => {
    expect(potMatchesQuery(spanish, '  spanish  ')).toBe(true);
    expect(potMatchesQuery(spanish, '  es  ')).toBe(true);
  });
});
