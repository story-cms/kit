import { test, expect } from '@playwright/test';
import {
  canPublishStory,
  missingPublishedChapters,
  publishBlockedMessage,
} from '../../src/shared/story_helpers.js';

test.describe('story publish readiness', () => {
  test('missingPublishedChapters returns zero when counts match', () => {
    expect(missingPublishedChapters(5, 5)).toBe(0);
  });

  test('missingPublishedChapters returns difference when below limit', () => {
    expect(missingPublishedChapters(3, 5)).toBe(2);
  });

  test('missingPublishedChapters never returns negative values', () => {
    expect(missingPublishedChapters(6, 5)).toBe(0);
  });

  test('canPublishStory is true when published count equals chapter limit', () => {
    expect(canPublishStory(5, 5)).toBe(true);
  });

  test('canPublishStory is false when published count is below chapter limit', () => {
    expect(canPublishStory(3, 5)).toBe(false);
  });

  test('publishBlockedMessage returns null when ready to publish', () => {
    expect(publishBlockedMessage(5, 5, 'Day', 'Edition')).toBeNull();
  });

  test('publishBlockedMessage returns expected string when chapters are missing', () => {
    expect(publishBlockedMessage(3, 5, 'Day', 'Edition')).toBe(
      'You need to add 2 more Days to your Edition.',
    );
  });
});
