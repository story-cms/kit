import { expect, test } from '@playwright/test';
import {
  getBlockRoleOptions,
  getDefaultBlockRole,
} from '../../src/frontend/stories/components/blocks/block-role-options.js';

test.describe('getBlockRoleOptions', () => {
  test('returns devotion roles for devotion template', () => {
    const options = getBlockRoleOptions('Day', 'devotion');

    expect(options.map((option) => option.value)).toEqual([
      'introduction',
      'scripture',
      'commentary',
      'reflection',
      'prayer',
      'response',
      'conclusion',
      'unclassified',
    ]);
  });

  test('returns course roles for course template', () => {
    const options = getBlockRoleOptions('Session', 'course');

    expect(options.map((option) => option.value)).toEqual([
      'introduction',
      'teaching',
      'scripture',
      'explanation',
      'example',
      'question',
      'discussion',
      'activity',
      'prayer',
      'response',
      'recap',
      'conclusion',
      'unclassified',
    ]);
  });

  test('returns course roles when chapter type is Session', () => {
    const options = getBlockRoleOptions('Session');

    expect(options.some((option) => option.value === 'teaching')).toBe(true);
    expect(options.some((option) => option.value === 'recap')).toBe(true);
  });

  test('returns fallback roles for unknown templates', () => {
    const options = getBlockRoleOptions('Episode');

    expect(options.map((option) => option.value)).toEqual([
      'summary',
      'introduction',
      'reflection',
    ]);
  });
});

test.describe('getDefaultBlockRole', () => {
  test('defaults to introduction for course and devotion', () => {
    expect(getDefaultBlockRole('Session', 'course')).toBe('introduction');
    expect(getDefaultBlockRole('Devotion', 'devotion')).toBe('introduction');
  });

  test('defaults to summary for fallback chapter types', () => {
    expect(getDefaultBlockRole('Episode')).toBe('summary');
  });
});
