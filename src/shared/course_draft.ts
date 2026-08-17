import type { ChapterBlock, CourseDraftBundle } from '../types.js';

const paddedDraftNumber = (number: number): string => String(number).padStart(2, '0');

export const createCourseDraftBundle = (number: number): CourseDraftBundle => ({
  number: paddedDraftNumber(number),
  title: '',
  description: '',
  coverImage: '',
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

export const normalizedCourseDraftBundle = (
  value: unknown,
  draftNumber: number,
): CourseDraftBundle => {
  const bundle = parsedBundle(value);
  const fallback = createCourseDraftBundle(draftNumber);

  return {
    number: stringValue(bundle.number).trim() || fallback.number,
    title: stringValue(bundle.title),
    description: stringValue(bundle.description),
    coverImage: stringValue(bundle.coverImage),
    blocks: Array.isArray(bundle.blocks) ? (bundle.blocks as ChapterBlock[]) : [],
    resources: Array.isArray(bundle.resources)
      ? bundle.resources.filter((id): id is string => typeof id === 'string')
      : [],
  };
};
