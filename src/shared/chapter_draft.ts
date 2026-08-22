import type { ChapterBlock, ChapterDraftAudio, ChapterDraftBundle } from '../types.js';
import { cloneBlocksStructure } from './block_structure.js';
import { COURSE_TEMPLATE_ID, DEVOTION_TEMPLATE_ID } from './story_helpers.js';

export type ChapterDraftExtraField = 'devotionAudio';

export type ChapterDraftTemplateId =
  typeof COURSE_TEMPLATE_ID | typeof DEVOTION_TEMPLATE_ID;

export interface ChapterDraftTemplate {
  id: ChapterDraftTemplateId;
  includeScriptureBlock: boolean;
  extraFields: readonly ChapterDraftExtraField[];
  defaultBlockRole: string;
}

export const chapterDraftTemplates: Record<ChapterDraftTemplateId, ChapterDraftTemplate> =
  {
    [COURSE_TEMPLATE_ID]: {
      id: COURSE_TEMPLATE_ID,
      includeScriptureBlock: false,
      extraFields: [],
      defaultBlockRole: 'introduction',
    },
    [DEVOTION_TEMPLATE_ID]: {
      id: DEVOTION_TEMPLATE_ID,
      includeScriptureBlock: true,
      extraFields: ['devotionAudio'],
      defaultBlockRole: 'introduction',
    },
  };

export const isChapterDraftTemplate = (
  template: string | null | undefined,
): template is ChapterDraftTemplateId =>
  typeof template === 'string' && template in chapterDraftTemplates;

export const chapterDraftTemplate = (
  template: string | null | undefined,
): ChapterDraftTemplate | undefined => {
  if (!isChapterDraftTemplate(template)) return undefined;
  return chapterDraftTemplates[template];
};

const paddedDraftNumber = (number: number): string => String(number).padStart(2, '0');

export const parsedBundle = (value: unknown): Record<string, unknown> => {
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

const emptyAudio = (): ChapterDraftAudio => ({ url: null, length: null });

const normalizedAudio = (value: unknown): ChapterDraftAudio => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return emptyAudio();
  }

  const audio = value as Record<string, unknown>;
  return {
    url: typeof audio.url === 'string' ? audio.url : null,
    length: typeof audio.length === 'number' ? audio.length : null,
  };
};

const extraFieldsFrom = (
  template: ChapterDraftTemplate,
  bundle: Record<string, unknown>,
): Partial<ChapterDraftBundle> => {
  const extras: Partial<ChapterDraftBundle> = {};
  if (template.extraFields.includes('devotionAudio')) {
    extras.devotionAudio = normalizedAudio(bundle.devotionAudio);
  }
  return extras;
};

const emptyExtraFields = (
  template: ChapterDraftTemplate,
): Partial<ChapterDraftBundle> => {
  const extras: Partial<ChapterDraftBundle> = {};
  if (template.extraFields.includes('devotionAudio')) {
    extras.devotionAudio = emptyAudio();
  }
  return extras;
};

const requireChapterDraftTemplate = (
  template: string | null | undefined,
): ChapterDraftTemplate => {
  const spec = chapterDraftTemplate(template);
  if (!spec) {
    throw new Error(`Unknown chapter draft template: ${String(template)}`);
  }
  return spec;
};

export const createChapterDraftBundle = (
  template: string | null | undefined,
  number: number,
): ChapterDraftBundle => {
  const spec = requireChapterDraftTemplate(template);

  return {
    number: paddedDraftNumber(number),
    title: '',
    description: '',
    coverImage: '',
    blocks: [],
    resources: [],
    ...emptyExtraFields(spec),
  };
};

export const normalizedChapterDraftBundle = (
  template: string | null | undefined,
  value: unknown,
  draftNumber: number,
): ChapterDraftBundle => {
  const spec = requireChapterDraftTemplate(template);
  const bundle = parsedBundle(value);
  const fallback = createChapterDraftBundle(spec.id, draftNumber);

  return {
    number: stringValue(bundle.number).trim() || fallback.number,
    title: stringValue(bundle.title),
    description: stringValue(bundle.description),
    coverImage: stringValue(bundle.coverImage),
    blocks: Array.isArray(bundle.blocks) ? (bundle.blocks as ChapterBlock[]) : [],
    resources: Array.isArray(bundle.resources)
      ? bundle.resources.filter((id): id is string => typeof id === 'string')
      : [],
    ...extraFieldsFrom(spec, bundle),
  };
};

export const translationChapterDraftBundle = (
  template: string | null | undefined,
  source: ChapterDraftBundle,
): ChapterDraftBundle => {
  const spec = requireChapterDraftTemplate(template);

  return {
    ...source,
    title: '',
    description: '',
    blocks: cloneBlocksStructure(source.blocks),
    resources: [],
    ...emptyExtraFields(spec),
  };
};
