import type { PreviewBundle } from '../types.js';
import {
  isChapterDraftTemplate,
  normalizedChapterDraftBundle,
  parsedBundle,
} from './chapter_draft.js';

export function previewBundleFrom(options: {
  chapter: { bundle: unknown; number: number };
  draft?: { bundle: unknown; number: number } | null;
  template?: string;
}): PreviewBundle {
  const source = options.draft ?? options.chapter;
  const { number } = source;

  if (isChapterDraftTemplate(options.template)) {
    return normalizedChapterDraftBundle(options.template, source.bundle, number);
  }

  return parsedBundle(source.bundle);
}
