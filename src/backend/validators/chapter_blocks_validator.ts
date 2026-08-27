import vine from '@vinejs/vine';
import type { FieldContext } from '@vinejs/vine/types';
import videoRule from './video_rule.js';

export const requiredString = () => vine.string().trim().minLength(1);

const visibilitySchema = vine.object({
  presenter: vine.boolean({ strict: true }),
  personal: vine.boolean({ strict: true }),
  inNavigation: vine.boolean({ strict: true }),
  hidden: vine.boolean({ strict: true }),
});

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

const itemSchema = vine.union([
  vine.union.if((value) => value.kind === 'image', imageItemSchema),
  vine.union.if((value) => value.kind === 'video', videoItemSchema),
  vine.union.if((value) => value.kind === 'scripture', scriptureItemSchema),
  vine.union.else(
    vine.object({
      id: requiredString(),
      kind: vine.enum(['image', 'video', 'scripture'] as const),
    }),
  ),
]);

const blockBase = {
  id: requiredString(),
  blockName: requiredString(),
  visibility: visibilitySchema,
};

const contentOrItemRule = vine.createRule(
  (value: unknown, _options: undefined, field: FieldContext) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return;

    const block = value as Record<string, unknown>;
    const hasContent = typeof block.content === 'string' && block.content.trim().length > 0;
    const hasItems = Array.isArray(block.items) && block.items.length > 0;
    if (!hasContent && !hasItems) {
      field.report(
        'A content block must have text or at least one media or scripture item',
        'contentOrItem',
        field,
      );
    }
  },
);

export const contentBlockSchema = vine
  .object({
    ...blockBase,
    kind: vine.literal('content'),
    displayName: requiredString(),
    blockRole: requiredString(),
    style: requiredString(),
    content: vine.string().optional(),
    items: vine.array(itemSchema).optional(),
    leadersNotes: vine.string().optional(),
    showLeadersNotes: vine.boolean({ strict: true }).optional(),
  })
  .bail(false)
  .use(contentOrItemRule());

export const titleBlockSchema = vine.object({
  ...blockBase,
  kind: vine.literal('title'),
  title: requiredString(),
  subtitle: vine.string().optional(),
  coverImage: vine.string().optional(),
});

export const scriptureBlockSchema = vine.object({
  ...blockBase,
  kind: vine.literal('scripture'),
  displayName: requiredString(),
  scripture: scriptureSchema,
  leadersNotes: vine.string().optional(),
  showLeadersNotes: vine.boolean({ strict: true }).optional(),
});

export function chapterBlockSchema(options?: { includeScriptureBlock?: boolean }) {
  const includeScriptureBlock = options?.includeScriptureBlock ?? true;

  if (!includeScriptureBlock) {
    return vine.union([
      vine.union.if((value) => value.kind === 'content', contentBlockSchema),
      vine.union.if((value) => value.kind === 'title', titleBlockSchema),
      vine.union.else(
        vine.object({
          ...blockBase,
          kind: vine.enum(['content', 'title'] as const),
        }),
      ),
    ]);
  }

  return vine.union([
    vine.union.if((value) => value.kind === 'content', contentBlockSchema),
    vine.union.if((value) => value.kind === 'title', titleBlockSchema),
    vine.union.if((value) => value.kind === 'scripture', scriptureBlockSchema),
    vine.union.else(
      vine.object({
        ...blockBase,
        kind: vine.enum(['content', 'title', 'scripture'] as const),
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
  'bundle.resources.*.uuid': 'Invalid resource',
};
