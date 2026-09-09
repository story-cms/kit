import vine from '@vinejs/vine';
import type { FieldContext } from '@vinejs/vine/types';
import type { StandardChapterTemplateId } from '../../shared/standard_chapter.js';
import { DEVOTION_TEMPLATE_ID } from '../../shared/story_helpers.js';
import videoRule from './video_rule.js';

export const requiredString = () => vine.string().trim().minLength(1);

const fullVisibilitySchema = vine.object({
  presenter: vine.boolean({ strict: true }),
  personal: vine.boolean({ strict: true }),
  inNavigation: vine.boolean({ strict: true }),
  hidden: vine.boolean({ strict: true }),
});

const devotionVisibilityRule = vine.createRule(
  (value: unknown, _options: undefined, field: FieldContext) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return;

    const visibility = value as Record<string, unknown>;
    if (visibility.presenter === true || visibility.personal === true || visibility.hidden === true) {
      field.report(
        'Presenter, Personal, and Hidden visibility are not available for this template',
        'devotionVisibility',
        field,
      );
    }
  },
);

const simplifiedVisibilitySchema = fullVisibilitySchema.clone().use(devotionVisibilityRule());

const visibilitySchema = (templateId?: StandardChapterTemplateId) =>
  templateId === DEVOTION_TEMPLATE_ID ? simplifiedVisibilitySchema : fullVisibilitySchema;

const scriptureSchema = vine.object({
  reference: requiredString(),
  verse: requiredString(),
});

const imageItemSchema = vine.object({
  id: requiredString(),
  kind: vine.literal('image'),
  imageUrl: vine.string().trim().url({ require_protocol: true }),
});

const videoItemSchema = vine.object({
  id: requiredString(),
  kind: vine.literal('video'),
  video: vine
    .object({
      url: vine.string().nullable(),
    })
    .use(videoRule(null)),
});

const scriptureItemSchema = vine.object({
  id: requiredString(),
  kind: vine.literal('scripture'),
  scripture: scriptureSchema,
});

const textItemSchema = vine.object({
  id: requiredString(),
  kind: vine.literal('text'),
  content: requiredString(),
});

const itemSchema = vine.union([
  vine.union.if((value) => value.kind === 'image', imageItemSchema),
  vine.union.if((value) => value.kind === 'video', videoItemSchema),
  vine.union.if((value) => value.kind === 'scripture', scriptureItemSchema),
  vine.union.if((value) => value.kind === 'text', textItemSchema),
  vine.union.else(
    vine.object({
      id: requiredString(),
      kind: vine.enum(['image', 'video', 'scripture', 'text'] as const),
    }),
  ),
]);

const blockBase = (templateId?: StandardChapterTemplateId) => ({
  id: requiredString(),
  blockName: requiredString(),
  visibility: visibilitySchema(templateId),
});

const contentOrItemRule = vine.createRule(
  (value: unknown, _options: undefined, field: FieldContext) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return;

    const block = value as Record<string, unknown>;
    const hasItems = Array.isArray(block.items) && block.items.length > 0;
    if (!hasItems) {
      field.report('A content block must have at least one item', 'contentOrItem', field);
    }
  },
);

const contentBlockSchema = (templateId?: StandardChapterTemplateId) =>
  vine
    .object({
      ...blockBase(templateId),
      kind: vine.literal('content'),
      displayName: requiredString(),
      blockRole: requiredString(),
      style: requiredString(),
      items: vine.array(itemSchema).optional(),
      leadersNotes: vine.string().optional(),
      showLeadersNotes: vine.boolean({ strict: true }).optional(),
    })
    .bail(false)
    .use(contentOrItemRule());

const titleBlockSchema = (templateId?: StandardChapterTemplateId) =>
  vine.object({
    ...blockBase(templateId),
    kind: vine.literal('title'),
    title: requiredString(),
    subtitle: vine.string().optional(),
    coverImage: vine.string().optional(),
  });

export function chapterBlockSchema(templateId?: StandardChapterTemplateId) {
  return vine.union([
    vine.union.if((value) => value.kind === 'content', contentBlockSchema(templateId)),
    vine.union.if((value) => value.kind === 'title', titleBlockSchema(templateId)),
    vine.union.else(
      vine.object({
        ...blockBase(templateId),
        kind: vine.enum(['content', 'title'] as const),
      }),
    ),
  ]);
}

export const chapterBlockErrorMessages = {
  'bundle.blocks.*.id.required': 'Every block must have an ID',
  'bundle.blocks.*.id.minLength': 'Every block must have an ID',
  'bundle.blocks.*.blockName.required': 'Every block must have a name',
  'bundle.blocks.*.blockName.minLength': 'Every block must have a name',
  'bundle.blocks.*.kind.enum':
    "This block type isn't supported for this chapter template",
  'bundle.blocks.*.items.*.kind.enum': "This item type isn't supported here",
  'bundle.blocks.*.visibility.devotionVisibility':
    'Presenter, Personal, and Hidden visibility are not available for this template',
  'bundle.resources.*.uuid': 'Invalid resource',
};
