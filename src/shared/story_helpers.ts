export interface StoryPublishMetadata {
  title: string;
  coverImage: string;
  storyType: string | null | undefined;
  chapterType: string | null | undefined;
  visibility: string;
}

const isBlank = (value: string | null | undefined): boolean => !value?.trim();

export const storyTypeBlockedMessages = (
  storyType: string | null | undefined,
  chapterType: string | null | undefined,
): string[] => {
  const messages: string[] = [];
  if (isBlank(storyType)) messages.push('Please choose a story type.');
  if (isBlank(chapterType)) messages.push('Please choose a chapter type.');
  return messages;
};

export const storyDetailsBlockedMessages = (metadata: StoryPublishMetadata): string[] => {
  const messages: string[] = [];
  if (isBlank(metadata.title)) messages.push('Please add a title.');
  if (isBlank(metadata.coverImage)) messages.push('Please add a cover image.');
  if (isBlank(metadata.visibility)) messages.push('Please choose a visibility.');
  return messages;
};

export const missingPublishedChapters = (
  publishedCount: number,
  chapterLimit: number,
): number => Math.max(0, chapterLimit - publishedCount);

export const canPublishStory = (publishedCount: number, chapterLimit: number): boolean =>
  missingPublishedChapters(publishedCount, chapterLimit) === 0;

export const publishBlockedMessage = (
  publishedCount: number,
  chapterLimit: number,
  chapterType: string | null | undefined,
  storyType: string | null | undefined,
): string | null => {
  if (isBlank(storyType) || isBlank(chapterType)) return null;

  const missing = missingPublishedChapters(publishedCount, chapterLimit);
  if (missing === 0) return null;

  return `You need to add ${missing} more ${chapterType}s to your ${storyType}.`;
};

export const storyMetadataBlockedMessages = (
  metadata: StoryPublishMetadata,
): string[] => [
  ...storyTypeBlockedMessages(metadata.storyType, metadata.chapterType),
  ...storyDetailsBlockedMessages(metadata),
];

export const canPublishStoryMetadata = (metadata: StoryPublishMetadata): boolean =>
  storyMetadataBlockedMessages(metadata).length === 0;

export const storyPublishBlockedMessage = (
  publishedCount: number,
  chapterLimit: number,
  metadata: StoryPublishMetadata,
): string | null => {
  const typeMessages = storyTypeBlockedMessages(metadata.storyType, metadata.chapterType);
  if (typeMessages.length > 0) return typeMessages[0];

  const chapterMessage = publishBlockedMessage(
    publishedCount,
    chapterLimit,
    metadata.chapterType,
    metadata.storyType,
  );
  if (chapterMessage) return chapterMessage;

  const metadataMessages = storyDetailsBlockedMessages(metadata);
  return metadataMessages[0] ?? null;
};

export const canPublishStoryReady = (
  publishedCount: number,
  chapterLimit: number,
  metadata: StoryPublishMetadata,
): boolean => storyPublishBlockedMessage(publishedCount, chapterLimit, metadata) === null;
