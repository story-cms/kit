import { expect, test } from '@playwright/test';
import {
  buildChapterDraftPayload,
  createAutosaveScheduler,
  findChapterDraftTab,
  withAttachedResource,
} from '../../src/frontend/stories/chapter-draft-edit-controller.js';

test.describe('chapter draft editor controller helpers', () => {
  test('selects a known tab from the query and falls back to Details', () => {
    expect(findChapterDraftTab('blocks')).toBe('Blocks');
    expect(findChapterDraftTab('RESOURCES')).toBe('Resources');
    expect(findChapterDraftTab('unknown')).toBe('Details');
    expect(findChapterDraftTab(null)).toBe('Details');
  });

  test('builds course and devotion payloads without losing bundle-specific fields', () => {
    expect(
      buildChapterDraftPayload(
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
      buildChapterDraftPayload(
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
