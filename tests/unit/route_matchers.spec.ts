import { test, expect } from '@playwright/test';

import { ID_PATTERN, idMatcher, parseId } from '../../src/backend/services/helpers';

const accepted = ['1', '8', '10', '999999999', '1000000000', '2147483646', '2147483647'];
const rejected = [
  '2147483648',
  '2147483649',
  '2200000000',
  '3000000000',
  '9999999999',
  '99999999999999999999',
  '0',
  '0001',
  '-1',
  '1.5',
  '1e3',
  'abc',
  'NaN',
  '8th 0',
  '',
];

test.describe('idMatcher', () => {
  for (const value of accepted) {
    test(`accepts ${value}`, () => {
      expect(ID_PATTERN.test(value)).toBe(true);
      expect(idMatcher.cast(value)).toBe(Number(value));
    });
  }

  for (const value of rejected) {
    test(`rejects "${value}"`, () => {
      expect(ID_PATTERN.test(value)).toBe(false);
    });
  }
});

test.describe('parseId', () => {
  test('parses canonical ids and already-cast numbers', () => {
    expect(parseId('42')).toBe(42);
    expect(parseId(42)).toBe(42);
    expect(parseId('2147483647')).toBe(2147483647);
  });

  test('returns undefined for invalid or out-of-range input', () => {
    for (const value of [...rejected, undefined, null, 2147483648, 0, 1.5, NaN]) {
      expect(parseId(value)).toBeUndefined();
    }
  });
});
