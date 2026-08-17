import { expect, test } from '@playwright/test';
import {
  createCourseDraftBundle,
  normalizedCourseDraftBundle,
} from '../../src/shared/course_draft.js';
import { isCourseTemplate } from '../../src/shared/story_helpers.js';

test.describe('course draft helpers', () => {
  test('matches only the exact course template identifier', () => {
    expect(isCourseTemplate('course')).toBe(true);
    expect(isCourseTemplate('Course')).toBe(false);
    expect(isCourseTemplate('course ')).toBe(false);
    expect(isCourseTemplate(undefined)).toBe(false);
  });

  test('creates the canonical empty bundle with a padded draft number', () => {
    expect(createCourseDraftBundle(1)).toEqual({
      number: '01',
      title: '',
      description: '',
      coverImage: '',
      blocks: [],
      resources: [],
    });
    expect(createCourseDraftBundle(12).number).toBe('12');
  });

  test('normalizes partial bundles without discarding content', () => {
    const block = {
      id: 'block-1',
      kind: 'title' as const,
      blockName: 'Heading',
      title: 'Welcome',
      subtitle: '',
      visibility: {
        presenter: true,
        personal: false,
        inNavigation: true,
        hidden: false,
      },
    };

    expect(
      normalizedCourseDraftBundle(
        {
          title: 'Existing session',
          blocks: [block],
          resources: ['resource-1', null, 2],
        },
        3,
      ),
    ).toEqual({
      number: '03',
      title: 'Existing session',
      description: '',
      coverImage: '',
      blocks: [block],
      resources: ['resource-1'],
    });
  });

  test('normalizes a JSON string bundle', () => {
    expect(
      normalizedCourseDraftBundle(
        JSON.stringify({
          number: '07',
          title: 'Session seven',
        }),
        1,
      ),
    ).toMatchObject({
      number: '07',
      title: 'Session seven',
    });
  });
});
