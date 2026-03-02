import { test, expect } from '@playwright/test';
import { normalizeDateForStorage } from '../../src/frontend/shared/helpers';

/**
 * Helpers that mirror date-range-field.vue storage format.
 * Date range is always date-only - both dates stored as T00:00:00.000Z.
 */
function formatDateRangeForStorage(start: Date, end: Date): string {
  const normalizedStart = normalizeDateForStorage(start, false);
  const normalizedEnd = normalizeDateForStorage(end, false);
  return `${normalizedStart.toISOString()}|${normalizedEnd.toISOString()}`;
}

test.describe('Date Range Field storage normalization', () => {
  test.describe('when user selects a date range (start and end dates)', () => {
    test('stores both dates as T00:00:00.000Z on the selected dates', () => {
      const startDate = new Date(2025, 2, 2, 14, 30, 0, 0); // March 2, 2025 2:30 PM local
      const endDate = new Date(2025, 2, 15, 9, 0, 0, 0); // March 15, 2025 9:00 AM local

      const result = formatDateRangeForStorage(startDate, endDate);

      expect(result).toBe('2025-03-02T00:00:00.000Z|2025-03-15T00:00:00.000Z');
    });

    test('produces format compatible with dateRangeRule validator', () => {
      const startDate = new Date(2025, 0, 1, 0, 0, 0, 0);
      const endDate = new Date(2025, 11, 31, 23, 59, 59, 999);

      const result = formatDateRangeForStorage(startDate, endDate);

      expect(result).toBe('2025-01-01T00:00:00.000Z|2025-12-31T00:00:00.000Z');
    });

    test('normalizes adjacent days to midnight UTC each', () => {
      const startDate = new Date(2025, 5, 14, 8, 0, 0, 0);
      const endDate = new Date(2025, 5, 15, 20, 0, 0, 0);

      const result = formatDateRangeForStorage(startDate, endDate);

      expect(result).toBe('2025-06-14T00:00:00.000Z|2025-06-15T00:00:00.000Z');
    });
  });

  test.describe('campaign window visibility', () => {
    test('start date at T00:00:00.000Z allows campaign visibility from midnight on that date', () => {
      const startDate = new Date(2025, 2, 10, 12, 0, 0, 0); // User selects March 10

      const normalized = normalizeDateForStorage(startDate, false);

      expect(normalized.toISOString()).toBe('2025-03-10T00:00:00.000Z');
    });

    test('end date at T00:00:00.000Z on last day includes full campaign window', () => {
      const endDate = new Date(2025, 2, 20, 23, 59, 59, 999); // User selects March 20

      const normalized = normalizeDateForStorage(endDate, false);

      expect(normalized.toISOString()).toBe('2025-03-20T00:00:00.000Z');
    });
  });
});
