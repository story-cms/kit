import { test, expect } from '@playwright/test';
import { indexCardTags } from '../../src/frontend/shared/helpers';

test.describe('indexCardTags', () => {
  test('returns Changed on Live/Ready scope when item has Draft tag', () => {
    expect(indexCardTags('Live', ['Live', 'Draft'])).toEqual(['Changed']);
    expect(indexCardTags('Ready', ['Draft'])).toEqual(['Changed']);
  });

  test('returns empty on Live/Ready scope when item has no Draft tag', () => {
    expect(indexCardTags('Live', ['Live'])).toEqual([]);
    expect(indexCardTags('Ready', [])).toEqual([]);
  });

  test('returns Changes on Changes scope regardless of tags', () => {
    expect(indexCardTags('Changes', [])).toEqual(['Changes']);
    expect(indexCardTags('Changes', ['Draft'])).toEqual(['Changes']);
  });

  test('returns Changes on non-Live/Ready scope when item has Live tag', () => {
    expect(indexCardTags('Draft', ['Live'])).toEqual(['Changes']);
  });

  test('returns New on Draft scope with no Live tag', () => {
    expect(indexCardTags('Draft', [])).toEqual(['New']);
    expect(indexCardTags('Draft', ['Draft'])).toEqual(['New']);
  });
});
