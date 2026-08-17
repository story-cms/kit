import type { ChapterBlock } from '../types.js';
import { normalizedCourseDraftBundle } from './course_draft.js';
import { normalizedDevotionDraftBundle } from './devotion_draft.js';

export interface StoryChapterSpecifier {
  apiVersion: number;
  locale: string;
  storyId: number;
  number: number;
}

export const previousDevotionChapterBlocks = async (
  specifier: StoryChapterSpecifier,
  loadBundle: (spec: StoryChapterSpecifier) => Promise<unknown | null>,
): Promise<ChapterBlock[]> => {
  if (specifier.number <= 1) {
    return [];
  }

  const previousNumber = specifier.number - 1;
  const bundle = await loadBundle({ ...specifier, number: previousNumber });

  if (bundle === null || bundle === undefined) {
    return [];
  }

  return normalizedDevotionDraftBundle(bundle, previousNumber).blocks;
};

export const previousCourseChapterBlocks = async (
  specifier: StoryChapterSpecifier,
  loadBundle: (spec: StoryChapterSpecifier) => Promise<unknown | null>,
): Promise<ChapterBlock[]> => {
  if (specifier.number <= 1) {
    return [];
  }

  const previousNumber = specifier.number - 1;
  const bundle = await loadBundle({ ...specifier, number: previousNumber });

  if (bundle === null || bundle === undefined) {
    return [];
  }

  return normalizedCourseDraftBundle(bundle, previousNumber).blocks;
};
