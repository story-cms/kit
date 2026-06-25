import type { HttpContext } from '@adonisjs/core/http';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import type { SchemaTypes } from '@vinejs/vine/types';
import videoRule from './video_rule.js';

const base = {
  title: vine.string().trim().minLength(1),
  type: vine.enum(['text', 'video', 'url_link'] as const),
  imageUrl: vine.string().optional(),
  description: vine.string().optional(),
  label: vine.string().trim().minLength(1),
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
    this.resourceType = ctx.request.input('type') ?? 'url_link';
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
      url: vine.string().url({
        require_protocol: true,
        protocols: ['http', 'https'],
      }),
    });
  }

  public get schema() {
    return vine.create(this.effectiveSchema);
  }
}

export const resourceErrorMessages = new SimpleMessagesProvider({
  'bundle.title.minLength': 'A resource must have a title',
  'bundle.label.minLength': 'A resource must have a label',
  'bundle.content.minLength': 'Text resources must have content',
  'bundle.url.url': 'URL link resources must have a valid URL',
  'bundle.video': 'Video resources must have a video',
});
