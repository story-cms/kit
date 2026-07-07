import type { HttpContext } from '@adonisjs/core/http';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import type { SchemaTypes } from '@vinejs/vine/types';
import videoRule from './video_rule.js';

const base = {
  title: vine.string().trim().minLength(1),
  type: vine.enum(['text', 'video', 'url'] as const),
  imageUrl: vine.string().optional(),
  description: vine.string().optional(),
  label: vine.string().trim().optional(),
  visibility: vine.enum(['public', 'guests', 'leaders'] as const),
  content: vine.string().optional(),
  url: vine.string().optional(),
  video: vine
    .object({
      url: vine.string().nullable().optional(),
    })
    .optional(),
};

const videoSchema = vine
  .object({
    url: vine.string().nullable(),
  })
  .use(videoRule(null));

export class ResourceValidator {
  protected resourceType: string;

  constructor(protected ctx: HttpContext) {
    this.resourceType = ctx.request.input('type') ?? 'url';
  }

  validate(data: Record<string, unknown>): Promise<any> {
    vine.messagesProvider = resourceErrorMessages;

    const schema = vine.object({
      bundle: this.effectiveSchema,
    });

    return vine.validate({ schema, data: { bundle: data } });
  }

  protected get effectiveSchema(): SchemaTypes {
    if (this.resourceType === 'text') {
      return vine.object({
        ...base,
        content: vine.string().trim().minLength(1),
      });
    }

    if (this.resourceType === 'video') {
      return vine.object({
        ...base,
        video: videoSchema,
      });
    }

    return vine.object({
      ...base,
      url: vine
        .string()
        .trim()
        .minLength(1)
        .url({
          require_protocol: true,
          protocols: ['http', 'https'],
        }),
    });
  }

  public get schema() {
    return vine.create(this.effectiveSchema);
  }
}

export const resourceValidationMessages = {
  'bundle.title.minLength': 'Please enter a title',
  'bundle.title.required': 'Please enter a title',
  'bundle.content.minLength': 'Please add some content',
  'bundle.content.required': 'Please add some content',
  'bundle.url.minLength': 'Please enter a URL',
  'bundle.url.required': 'Please enter a URL',
  'bundle.url.url': 'Please enter a valid URL',
  'bundle.video': 'Please upload a video',
  'bundle.video.required': 'Please upload a video',
};

export const resourceErrorMessages = new SimpleMessagesProvider(resourceValidationMessages);
