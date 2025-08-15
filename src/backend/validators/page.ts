import vine, { SimpleMessagesProvider, VineValidator } from '@vinejs/vine';
import type { HttpContext } from '@adonisjs/core/http';

const draft = {
  title: vine.string(),
  icon: vine.string().optional(),
  description: vine.string().optional(),
  body: vine.string().optional(),
  type: vine.string().optional(),
  isPublished: vine.boolean(),
};

const live = {
  title: vine.string(),
  icon: vine.string(),
  description: vine.string(),
  body: vine.string(),
  type: vine.string(),
  isPublished: vine.boolean(),
};

export class PageValidator {
  protected isLink: boolean;
  protected isPublished: boolean;

  constructor(protected ctx: HttpContext) {
    this.isLink = ctx.request.input('type') === 'link';
    this.isPublished = ctx.request.input('isPublished') === true;
  }

  public get schema(): VineValidator<any, Record<string, any> | undefined> {
    if (!this.isPublished) return vine.compile(vine.object(draft));
    if (this.isLink) {
      const liveLinkSchema = {
        ...live,
        body: vine.string().url({
          require_protocol: true,
          protocols: ['http', 'https'],
        }),
      };
      return vine.compile(vine.object(liveLinkSchema));
    }
    return vine.compile(vine.object(live));
  }
}

export const pageErrorMessages = new SimpleMessagesProvider({
  title: 'Title must be a string',
  description: 'Description must be a string',
  'title.required': 'A title is required',
  'description.required': 'A description is required',
});
