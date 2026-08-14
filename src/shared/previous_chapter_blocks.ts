import type { ChapterBlock } from '../types.js';
import { normalizeDevotionDraftBundle } from './devotion_draft.js';

export interface StoryChapterSpecifier {
  apiVersion: number;
  locale: string;
  storyId: number;
  number: number;
}

export const getPreviousDevotionChapterBlocks = async (
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

  return normalizeDevotionDraftBundle(bundle, previousNumber).blocks;
};
