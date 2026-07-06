import { test, expect } from '@playwright/test';
import {
  canPublishStory,
  canPublishStoryMetadata,
  canPublishStoryReady,
  missingPublishedChapters,
  publishBlockedMessage,
  storyMetadataBlockedMessages,
  storyPublishBlockedMessage,
  type StoryPublishMetadata,
} from '../../src/shared/story_helpers.js';

const completeMetadata: StoryPublishMetadata = {
  title: 'Classic',
  coverImage: 'https://example.com/cover.jpg',
  storyType: 'Edition',
  chapterType: 'Day',
  visibility: 'public',
};

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

test.describe('story metadata publish readiness', () => {
  test('canPublishStoryMetadata is true when all metadata is present', () => {
    expect(canPublishStoryMetadata(completeMetadata)).toBe(true);
  });

  test('storyMetadataBlockedMessages reports missing cover image', () => {
    expect(
      storyMetadataBlockedMessages({ ...completeMetadata, coverImage: '' }),
    ).toContain('Your story must have a cover image');
  });

  test('storyMetadataBlockedMessages reports missing story type', () => {
    expect(
      storyMetadataBlockedMessages({ ...completeMetadata, storyType: '' }),
    ).toContain('How about "Story"? We need to call it something.');
  });

  test('storyMetadataBlockedMessages reports missing chapter type', () => {
    expect(
      storyMetadataBlockedMessages({ ...completeMetadata, chapterType: '' }),
    ).toContain('Choose something like "Session", "Lesson", "Episode"');
  });

  test('storyMetadataBlockedMessages reports missing visibility', () => {
    expect(
      storyMetadataBlockedMessages({ ...completeMetadata, visibility: '' }),
    ).toContain('Choose the visibility of the story');
  });

  test('storyMetadataBlockedMessages reports missing title', () => {
    expect(
      storyMetadataBlockedMessages({ ...completeMetadata, title: '   ' }),
    ).toContain('Your story must have a title');
  });

  test('storyPublishBlockedMessage prioritizes missing chapters over metadata', () => {
    expect(
      storyPublishBlockedMessage(3, 5, { ...completeMetadata, coverImage: '' }),
    ).toBe('You need to add 2 more Days to your Edition.');
  });

  test('storyPublishBlockedMessage reports metadata when chapters are ready', () => {
    expect(
      storyPublishBlockedMessage(5, 5, { ...completeMetadata, coverImage: '' }),
    ).toBe('Your story must have a cover image');
  });

  test('canPublishStoryReady is true when chapters and metadata are complete', () => {
    expect(canPublishStoryReady(5, 5, completeMetadata)).toBe(true);
  });

  test('canPublishStoryReady is false when metadata is incomplete', () => {
    expect(
      canPublishStoryReady(5, 5, { ...completeMetadata, storyType: '' }),
    ).toBe(false);
  });
});
