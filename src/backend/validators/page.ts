import { HttpContext } from '@adonisjs/core/http';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import { SchemaTypes } from '@vinejs/vine/types';

const draft = {
  title: vine.string().trim().minLength(1),
  icon: vine.string().optional(),
  description: vine.string().optional(),
  body: vine.string().optional(),
  category: vine.string().optional(),
  type: vine.string().optional(),
  isPublished: vine.boolean(),
};

const live = {
  title: vine.string().trim().minLength(1),
  icon: vine.string().trim().minLength(1),
  description: vine.string().trim().minLength(1),
  body: vine.string().trim().minLength(1),
  type: vine.string().trim().minLength(1),
  category: vine.string().optional(),
  isPublished: vine.boolean(),
};

export default class PageValidator {
  protected isLink: boolean;
  protected isPublished: boolean;

  constructor(protected ctx: HttpContext) {
    this.isLink = ctx.request.input('type') === 'link';
    this.isPublished = ctx.request.input('isPublished') === true;
  }

  validate(data: any): Promise<any> {
    vine.messagesProvider = new SimpleMessagesProvider({
      'bundle.title.minLength': 'A page must have a title',
      'bundle.icon.minLength': 'A page must have an icon',
      'bundle.description.minLength': 'A page must have a description',
      'bundle.body.minLength': 'A page must have a body',
      'bundle.body.url': 'A link page must have a valid URL',
    });

    const schema = vine.object({
      bundle: this.effectiveSchema,
    });

    return vine.validate({ schema, data: { bundle: data } });
  }

  protected get effectiveSchema(): SchemaTypes {
    if (!this.isPublished) return vine.object(draft);
    if (this.isLink) {
      const liveLinkSchema = {
        ...live,
        body: vine.string().url({
          require_protocol: true,
          protocols: ['http', 'https'],
        }),
      };
      return vine.object(liveLinkSchema);
    }
    return vine.object(live);
  }
}
