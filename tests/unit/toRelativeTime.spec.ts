import { test, expect } from '@playwright/test';
import { DateTime } from 'luxon';

import { toRelativeTime } from '../../src/frontend/shared/helpers';

const now = DateTime.fromISO('2026-07-13T12:00:00.000Z');

const hoursAgo = (n: number): string => now.minus({ hours: n }).toISO() as string;
const daysAgo = (n: number): string => now.minus({ days: n }).toISO() as string;

test.describe('toRelativeTime', () => {
  test('returns "Today" for the current day', () => {
    expect(toRelativeTime(hoursAgo(5), now)).toBe('Today');
  });

  test('returns "Yesterday" for one day ago', () => {
    expect(toRelativeTime(daysAgo(1), now)).toBe('Yesterday');
  });

  test('returns the weekday name between 2 and 6 days ago', () => {
    expect(toRelativeTime(daysAgo(3), now)).toBe(now.minus({ days: 3 }).toFormat('cccc'));
    expect(toRelativeTime(daysAgo(6), now)).toBe(now.minus({ days: 6 }).toFormat('cccc'));
  });

  test('returns an ordinal day and month within the same year', () => {
    expect(toRelativeTime('2026-07-01T12:00:00.000Z', now)).toBe('1st July');
    expect(toRelativeTime('2026-06-02T12:00:00.000Z', now)).toBe('2nd June');
    expect(toRelativeTime('2026-05-03T12:00:00.000Z', now)).toBe('3rd May');
    expect(toRelativeTime('2026-01-11T12:00:00.000Z', now)).toBe('11th January');
    expect(toRelativeTime('2026-02-21T12:00:00.000Z', now)).toBe('21st February');
    expect(toRelativeTime('2026-03-22T12:00:00.000Z', now)).toBe('22nd March');
    expect(toRelativeTime('2026-04-23T12:00:00.000Z', now)).toBe('23rd April');
    expect(toRelativeTime('2026-01-31T12:00:00.000Z', now)).toBe('31st January');
  });

  test('falls back to dd/MM/yyyy across a year boundary', () => {
    const laterNow = DateTime.fromISO('2026-01-10T12:00:00.000Z');
    expect(toRelativeTime('2025-12-31T12:00:00.000Z', laterNow)).toBe('31/12/2025');
  });
});
