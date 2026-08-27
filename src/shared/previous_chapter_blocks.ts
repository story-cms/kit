import type { ChapterBlock, StoryChapterSpecifier } from '../types.js';
import {
  isStandardChapterTemplate,
  normalizedStandardChapterBundle,
} from './standard_chapter.js';

export const previousChapterBlocks = async (
  template: string | null | undefined,
  specifier: StoryChapterSpecifier,
  loadBundle: (spec: StoryChapterSpecifier) => Promise<unknown | null>,
): Promise<ChapterBlock[]> => {
  if (specifier.number <= 1 || !isStandardChapterTemplate(template)) {
    return [];
  }

  const previousNumber = specifier.number - 1;
  const bundle = await loadBundle({ ...specifier, number: previousNumber });

  if (bundle === null || bundle === undefined) {
    return [];
  }

  return normalizedStandardChapterBundle(template, bundle, previousNumber).blocks;
};
