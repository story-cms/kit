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
