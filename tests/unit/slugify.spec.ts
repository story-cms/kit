import { test, expect } from '@playwright/test';

import { slugify } from '../../src/backend/services/helpers.js';

test.describe('slugify', () => {
  test('lowercases and hyphenates simple titles', () => {
    expect(slugify('My Cool Story!')).toBe('my-cool-story');
    expect(slugify('Genesis Devotional')).toBe('genesis-devotional');
  });

  test('collapses whitespace and underscores to a single hyphen', () => {
    expect(slugify('My  Cool  Story')).toBe('my-cool-story');
    expect(slugify('hello_world')).toBe('hello-world');
    expect(slugify('hello\tworld')).toBe('hello-world');
  });

  test('transliterates accented characters', () => {
    expect(slugify('Café Stories')).toBe('cafe-stories');
    expect(slugify('Naïve')).toBe('naive');
  });

  test('trims leading and trailing whitespace and punctuation', () => {
    expect(slugify(' Hello ')).toBe('hello');
    expect(slugify('---Hello---')).toBe('hello');
  });

  test('preserves existing hyphens and numbers', () => {
    expect(slugify('pre-existing')).toBe('pre-existing');
    expect(slugify('Chapter 1')).toBe('chapter-1');
  });

  test('returns an empty string when nothing slug-worthy remains', () => {
    expect(slugify('')).toBe('');
    expect(slugify('!!!')).toBe('');
    expect(slugify('   ')).toBe('');
  });
});
