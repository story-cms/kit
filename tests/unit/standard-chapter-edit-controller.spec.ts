import { expect, test } from '@playwright/test';
import {
  buildStandardChapterPayload,
  createAutosaveScheduler,
  estimatedTokenRange,
  findStandardChapterTab,
  hasSufficientBalance,
  withAttachedResource,
} from '../../src/frontend/stories/standard-chapter-edit-controller.js';

test.describe('standard chapter editor controller helpers', () => {
  test('selects a known tab from the query and falls back to Details', () => {
    expect(findStandardChapterTab('blocks')).toBe('Blocks');
    expect(findStandardChapterTab('RESOURCES')).toBe('Resources');
    expect(findStandardChapterTab('unknown')).toBe('Details');
    expect(findStandardChapterTab(null)).toBe('Details');
  });

  test('builds course and devotion payloads without losing bundle-specific fields', () => {
    expect(
      buildStandardChapterPayload(
        {
          number: '03',
          title: 'Morning Devotion',
          devotionAudio: { url: 'morning.mp3', length: 90 },
          resources: [{ id: 'stale-resource' }],
        },
        [{ id: 'resource-1' }, { id: 'resource-2' }],
      ),
    ).toEqual({
      feedback: '',
      bundle: {
        number: '03',
        title: 'Morning Devotion',
        devotionAudio: { url: 'morning.mp3', length: 90 },
        resources: ['resource-1', 'resource-2'],
      },
    });

    expect(
      buildStandardChapterPayload(
        {
          number: '04',
          title: 'Course Session',
          template: 'course-only-value',
          resources: [],
        },
        [],
      ),
    ).toEqual({
      feedback: '',
      bundle: {
        number: '04',
        title: 'Course Session',
        template: 'course-only-value',
        resources: [],
      },
    });
  });

  test('attaches a returned resource once and ignores missing resources', () => {
    const attached = [{ id: 'resource-1', title: 'Existing' }];
    const available = [...attached, { id: 'resource-2', title: 'Returned resource' }];

    expect(withAttachedResource(attached, available, 'resource-2')).toEqual([
      { id: 'resource-1', title: 'Existing' },
      { id: 'resource-2', title: 'Returned resource' },
    ]);
    expect(withAttachedResource(attached, available, 'resource-1')).toEqual(attached);
    expect(withAttachedResource(attached, available, 'missing')).toEqual(attached);
    expect(withAttachedResource(attached, available, null)).toEqual(attached);
  });

  test('waits two seconds, replaces pending saves, and supports cancellation', () => {
    let nextTimer = 1;
    const pending = new Map<number, () => void>();
    const delays: number[] = [];
    let saves = 0;
    const scheduler = createAutosaveScheduler(
      () => {
        saves += 1;
      },
      {
        setTimeout: (callback, delay) => {
          const timer = nextTimer++;
          delays.push(delay);
          pending.set(timer, callback);
          return timer;
        },
        clearTimeout: (timer) => {
          pending.delete(timer as number);
        },
      },
    );

    scheduler.schedule();
    expect(delays).toEqual([2000]);
    expect(saves).toBe(0);

    scheduler.schedule();
    expect([...pending.keys()]).toEqual([2]);
    const pendingSave = pending.get(2);
    pending.delete(2);
    pendingSave?.();
    expect(saves).toBe(1);

    scheduler.schedule();
    scheduler.cancel();
    expect(pending.size).toBe(0);
    expect(saves).toBe(1);
  });
});

test.describe('estimatedTokenRange', () => {
  test('spreads +-20% around the input+output sum', () => {
    expect(estimatedTokenRange(500, 500)).toEqual({ low: 800, high: 1200 });
    expect(estimatedTokenRange(0, 0)).toEqual({ low: 0, high: 0 });
  });
});

test.describe('hasSufficientBalance', () => {
  test('is insufficient when balance is below the high end of the range', () => {
    // sum = 1000 -> high = 1200
    expect(hasSufficientBalance(1199, 500, 500)).toBe(false);
    expect(hasSufficientBalance(0, 500, 500)).toBe(false);
  });

  test('is sufficient once balance reaches the high end of the range', () => {
    expect(hasSufficientBalance(1200, 500, 500)).toBe(true);
    expect(hasSufficientBalance(5000, 500, 500)).toBe(true);
  });
});
