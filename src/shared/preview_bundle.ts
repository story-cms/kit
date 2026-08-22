import type { PreviewBundle } from '../types.js';
import {
  isStandardChapterTemplate,
  normalizedStandardChapterBundle,
  parsedBundle,
} from './standard_chapter.js';

export function previewBundleFrom(options: {
  chapter: { bundle: unknown; number: number };
  draft?: { bundle: unknown; number: number } | null;
  template?: string;
}): PreviewBundle {
  const source = options.draft ?? options.chapter;
  const { number } = source;

  if (isStandardChapterTemplate(options.template)) {
    return normalizedStandardChapterBundle(options.template, source.bundle, number);
  }

  return parsedBundle(source.bundle);
}
