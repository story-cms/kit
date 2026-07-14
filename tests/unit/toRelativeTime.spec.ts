import { test, expect } from '@playwright/test';
import { DateTime } from 'luxon';

import { toRelativeTime } from '../../src/frontend/shared/helpers';

const now = DateTime.fromISO('2026-07-13T12:00:00.000Z');

const secondsAgo = (n: number): string => now.minus({ seconds: n }).toISO() as string;

test.describe('toRelativeTime', () => {
  test('returns "1 sec ago" at zero elapsed time', () => {
    expect(toRelativeTime(secondsAgo(0), now)).toBe('1 sec ago');
  });

  test('returns singular "1 sec ago"', () => {
    expect(toRelativeTime(secondsAgo(1), now)).toBe('1 sec ago');
  });

  test('returns plural seconds', () => {
    expect(toRelativeTime(secondsAgo(2), now)).toBe('2 secs ago');
  });

  test('stays in seconds just before the minute rollover', () => {
    expect(toRelativeTime(secondsAgo(59), now)).toBe('59 secs ago');
  });

  test('rolls over to singular "1 min ago" at 60 seconds', () => {
    expect(toRelativeTime(secondsAgo(60), now)).toBe('1 min ago');
  });

  test('returns plural minutes', () => {
    expect(toRelativeTime(secondsAgo(125), now)).toBe('2 mins ago');
  });

  test('stays in minutes just before the hour rollover', () => {
    expect(toRelativeTime(secondsAgo(3599), now)).toBe('59 mins ago');
  });

  test('rolls over to singular "1 hour ago" at 3600 seconds', () => {
    expect(toRelativeTime(secondsAgo(3600), now)).toBe('1 hour ago');
  });

  test('returns plural hours', () => {
    expect(toRelativeTime(secondsAgo(7200), now)).toBe('2 hours ago');
  });

  test('stays in hours just before the day rollover', () => {
    expect(toRelativeTime(secondsAgo(86399), now)).toBe('23 hours ago');
  });

  test('rolls over to singular "1 day ago" at 86400 seconds', () => {
    expect(toRelativeTime(secondsAgo(86400), now)).toBe('1 day ago');
  });

  test('returns plural days', () => {
    expect(toRelativeTime(secondsAgo(172800), now)).toBe('2 days ago');
  });

  test('stays in days just before the week rollover', () => {
    expect(toRelativeTime(secondsAgo(6 * 86400), now)).toBe('6 days ago');
  });

  test('switches to absolute date/time at 7 days elapsed', () => {
    const value = '2026-07-02T17:11:00.000Z';
    expect(toRelativeTime(value, now)).toBe('on 02/07/2026 at 5:11pm');
  });

  test('formats the absolute date across a month/year rollover', () => {
    const laterNow = DateTime.fromISO('2026-01-10T09:05:00.000Z');
    const value = '2025-12-31T09:05:00.000Z';
    expect(toRelativeTime(value, laterNow)).toBe('on 31/12/2025 at 9:05am');
  });

  test('formats midnight as 12am in the absolute format', () => {
    const laterNow = DateTime.fromISO('2026-01-09T00:00:00.000Z');
    const value = '2026-01-01T00:00:00.000Z';
    expect(toRelativeTime(value, laterNow)).toBe('on 01/01/2026 at 12:00am');
  });

  test('formats noon as 12pm in the absolute format', () => {
    const laterNow = DateTime.fromISO('2026-01-09T12:00:00.000Z');
    const value = '2026-01-01T12:00:00.000Z';
    expect(toRelativeTime(value, laterNow)).toBe('on 01/01/2026 at 12:00pm');
  });
});
