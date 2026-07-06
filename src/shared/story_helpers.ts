export interface StoryPublishMetadata {
  title: string;
  coverImage: string;
  storyType: string;
  chapterType: string;
  visibility: string;
}

export const missingPublishedChapters = (
  publishedCount: number,
  chapterLimit: number,
): number => Math.max(0, chapterLimit - publishedCount);

export const canPublishStory = (publishedCount: number, chapterLimit: number): boolean =>
  missingPublishedChapters(publishedCount, chapterLimit) === 0;

export const publishBlockedMessage = (
  publishedCount: number,
  chapterLimit: number,
  chapterType: string,
  storyType: string,
): string | null => {
  const missing = missingPublishedChapters(publishedCount, chapterLimit);
  if (missing === 0) return null;

  return `You need to add ${missing} more ${chapterType}s to your ${storyType}.`;
};

export const storyMetadataBlockedMessages = (
  metadata: StoryPublishMetadata,
): string[] => {
  const messages: string[] = [];

  if (!metadata.title.trim()) {
    messages.push('Your story must have a title');
  }
  if (!metadata.coverImage.trim()) {
    messages.push('Your story must have a cover image');
  }
  if (!metadata.storyType.trim()) {
    messages.push('How about "Story"? We need to call it something.');
  }
  if (!metadata.chapterType.trim()) {
    messages.push('Choose something like "Session", "Lesson", "Episode"');
  }
  if (!metadata.visibility.trim()) {
    messages.push('Choose the visibility of the story');
  }

  return messages;
};

export const canPublishStoryMetadata = (metadata: StoryPublishMetadata): boolean =>
  storyMetadataBlockedMessages(metadata).length === 0;

export const storyPublishBlockedMessage = (
  publishedCount: number,
  chapterLimit: number,
  metadata: StoryPublishMetadata,
): string | null => {
  const chapterMessage = publishBlockedMessage(
    publishedCount,
    chapterLimit,
    metadata.chapterType,
    metadata.storyType,
  );
  if (chapterMessage) return chapterMessage;

  const metadataMessages = storyMetadataBlockedMessages(metadata);
  return metadataMessages[0] ?? null;
};

export const canPublishStoryReady = (
  publishedCount: number,
  chapterLimit: number,
  metadata: StoryPublishMetadata,
): boolean => storyPublishBlockedMessage(publishedCount, chapterLimit, metadata) === null;
