import { test, expect } from '@playwright/test';
import { normalizeDateForStorage } from '../../src/frontend/shared/helpers';

test.describe('Date Field storage normalization', () => {
  test.describe('when user selects today (date-only, no time picker)', () => {
    test('stores value as T00:00:00.000Z on the date selected for instant campaign visibility', () => {
      // User selects today - e.g. 2025-03-02 in local timezone
      const selectedDate = new Date(2025, 2, 2, 14, 30, 0, 0); // March 2, 2025 2:30 PM local

      const result = normalizeDateForStorage(selectedDate, false);

      expect(result.toISOString()).toBe('2025-03-02T00:00:00.000Z');
    });
  });

  test.describe('when user selects any other day (date-only, no time picker)', () => {
    test('stores value as T00:00:00.000Z on the date selected so campaign is shown from that time', () => {
      // User selects a future date - e.g. 2025-03-15
      const selectedDate = new Date(2025, 2, 15, 9, 0, 0, 0); // March 15, 2025 9:00 AM local

      const result = normalizeDateForStorage(selectedDate, false);

      expect(result.toISOString()).toBe('2025-03-15T00:00:00.000Z');
    });

    test('stores value as T00:00:00.000Z for a past date', () => {
      const selectedDate = new Date(2024, 0, 1, 23, 59, 59, 999); // Jan 1, 2024 late local

      const result = normalizeDateForStorage(selectedDate, false);

      expect(result.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    });
  });

  test.describe('when date picker is at midnight local time', () => {
    test('still normalizes to T00:00:00.000Z for the selected date', () => {
      // VueDatePicker may give midnight local - e.g. 2025-03-02T08:00:00Z for PST
      const selectedDate = new Date(2025, 2, 2, 0, 0, 0, 0);

      const result = normalizeDateForStorage(selectedDate, false);

      expect(result.toISOString()).toBe('2025-03-02T00:00:00.000Z');
    });
  });

  test.describe('when endOfDay is true (for range end dates)', () => {
    test('stores value as T23:59:59.999Z on the selected date', () => {
      const selectedDate = new Date(2025, 2, 15, 9, 0, 0, 0); // March 15, 2025 9:00 AM local

      const result = normalizeDateForStorage(selectedDate, false, true);

      expect(result.toISOString()).toBe('2025-03-15T23:59:59.999Z');
    });
  });

  test.describe('when time picker is enabled', () => {
    test('preserves the full date and time without normalization', () => {
      const selectedDate = new Date(2025, 2, 2, 14, 30, 45, 123);

      const result = normalizeDateForStorage(selectedDate, true);

      expect(result.getTime()).toBe(selectedDate.getTime());
      expect(result.toISOString()).not.toMatch(/T00:00:00\.000Z$/);
    });
  });
});
