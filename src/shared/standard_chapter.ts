import type { ChapterBlock, StandardChapterAudio, StandardChapterBundle } from '../types.js';
import { cloneBlocksStructure } from './block_structure.js';
import { COURSE_TEMPLATE_ID, DEVOTION_TEMPLATE_ID } from './story_helpers.js';

export type StandardChapterExtraField = 'devotionAudio';

export type StandardChapterTemplateId =
  typeof COURSE_TEMPLATE_ID | typeof DEVOTION_TEMPLATE_ID;

export interface StandardChapterTemplate {
  id: StandardChapterTemplateId;
  includeScriptureBlock: boolean;
  extraFields: readonly StandardChapterExtraField[];
  defaultBlockRole: string;
}

export const standardChapterTemplates: Record<StandardChapterTemplateId, StandardChapterTemplate> =
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

export const isStandardChapterTemplate = (
  template: string | null | undefined,
): template is StandardChapterTemplateId =>
  typeof template === 'string' && template in standardChapterTemplates;

export const standardChapterTemplate = (
  template: string | null | undefined,
): StandardChapterTemplate | undefined => {
  if (!isStandardChapterTemplate(template)) return undefined;
  return standardChapterTemplates[template];
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

const emptyAudio = (): StandardChapterAudio => ({ url: null, length: null });

const normalizedAudio = (value: unknown): StandardChapterAudio => {
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
  template: StandardChapterTemplate,
  bundle: Record<string, unknown>,
): Partial<StandardChapterBundle> => {
  const extras: Partial<StandardChapterBundle> = {};
  if (template.extraFields.includes('devotionAudio')) {
    extras.devotionAudio = normalizedAudio(bundle.devotionAudio);
  }
  return extras;
};

const emptyExtraFields = (
  template: StandardChapterTemplate,
): Partial<StandardChapterBundle> => {
  const extras: Partial<StandardChapterBundle> = {};
  if (template.extraFields.includes('devotionAudio')) {
    extras.devotionAudio = emptyAudio();
  }
  return extras;
};

const requireStandardChapterTemplate = (
  template: string | null | undefined,
): StandardChapterTemplate => {
  const spec = standardChapterTemplate(template);
  if (!spec) {
    throw new Error(`Unknown standard chapter template: ${String(template)}`);
  }
  return spec;
};

export const createStandardChapterBundle = (
  template: string | null | undefined,
  number: number,
): StandardChapterBundle => {
  const spec = requireStandardChapterTemplate(template);

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

export const normalizedStandardChapterBundle = (
  template: string | null | undefined,
  value: unknown,
  draftNumber: number,
): StandardChapterBundle => {
  const spec = requireStandardChapterTemplate(template);
  const bundle = parsedBundle(value);
  const fallback = createStandardChapterBundle(spec.id, draftNumber);

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

export const translationStandardChapterBundle = (
  template: string | null | undefined,
  source: StandardChapterBundle,
): StandardChapterBundle => {
  const spec = requireStandardChapterTemplate(template);

  return {
    ...source,
    title: '',
    description: '',
    blocks: cloneBlocksStructure(source.blocks),
    resources: [],
    ...emptyExtraFields(spec),
  };
};
