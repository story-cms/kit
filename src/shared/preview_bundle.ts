import type { PreviewBundle } from '../types.js';
import { normalizedDevotionDraftBundle } from './devotion_draft.js';
import { isDevotionTemplate } from './story_helpers.js';

const parseBundle = (value: unknown): Record<string, unknown> => {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }

  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
};

export function previewBundleFrom(options: {
  chapter: { bundle: unknown; number: number };
  draft?: { bundle: unknown; number: number } | null;
  template?: string;
}): PreviewBundle {
  const source = options.draft ?? options.chapter;
  const { number } = source;

  if (isDevotionTemplate(options.template)) {
    return normalizedDevotionDraftBundle(source.bundle, number);
  }

  return parseBundle(source.bundle);
}
