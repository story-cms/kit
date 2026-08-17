import type { ChapterBlock, DevotionDraftBundle } from '../types.js';

const paddedDraftNumber = (number: number): string => String(number).padStart(2, '0');

export const createDevotionDraftBundle = (number: number): DevotionDraftBundle => ({
  number: paddedDraftNumber(number),
  title: '',
  description: '',
  coverImage: '',
  devotionAudio: { url: null, length: null },
  blocks: [],
  resources: [],
});

const parsedBundle = (value: unknown): Record<string, unknown> => {
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

const stringValue = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const normalizedAudio = (
  value: unknown,
): DevotionDraftBundle['devotionAudio'] => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { url: null, length: null };
  }

  const audio = value as Record<string, unknown>;
  return {
    url: typeof audio.url === 'string' ? audio.url : null,
    length: typeof audio.length === 'number' ? audio.length : null,
  };
};

export const normalizedDevotionDraftBundle = (
  value: unknown,
  draftNumber: number,
): DevotionDraftBundle => {
  const bundle = parsedBundle(value);
  const fallback = createDevotionDraftBundle(draftNumber);

  return {
    number: stringValue(bundle.number).trim() || fallback.number,
    title: stringValue(bundle.title),
    description: stringValue(bundle.description),
    coverImage: stringValue(bundle.coverImage),
    devotionAudio: normalizedAudio(bundle.devotionAudio),
    blocks: Array.isArray(bundle.blocks) ? (bundle.blocks as ChapterBlock[]) : [],
    resources: Array.isArray(bundle.resources)
      ? bundle.resources.filter((id): id is string => typeof id === 'string')
      : [],
  };
};
