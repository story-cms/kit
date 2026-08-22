import type { ChapterBlock, StoryChapterSpecifier } from '../types.js';
import {
  isChapterDraftTemplate,
  normalizedChapterDraftBundle,
} from './chapter_draft.js';

export const previousChapterBlocks = async (
  template: string | null | undefined,
  specifier: StoryChapterSpecifier,
  loadBundle: (spec: StoryChapterSpecifier) => Promise<unknown | null>,
): Promise<ChapterBlock[]> => {
  if (specifier.number <= 1 || !isChapterDraftTemplate(template)) {
    return [];
  }

  const previousNumber = specifier.number - 1;
  const bundle = await loadBundle({ ...specifier, number: previousNumber });

  if (bundle === null || bundle === undefined) {
    return [];
  }

  return normalizedChapterDraftBundle(template, bundle, previousNumber).blocks;
};
