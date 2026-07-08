import type { HttpContext } from '@adonisjs/core/http';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import type { SchemaTypes } from '@vinejs/vine/types';

const draft = {
  title: vine.string().trim().minLength(1),
  coverImage: vine.string().optional(),
  description: vine.string().trim().optional(),
  chapterLimit: vine.number().min(1),
  tags: vine.string().optional(),
  storyType: vine.string().trim().minLength(1),
  chapterType: vine.string().trim().minLength(1),
  sectionType: vine.string().optional(),
  visibility: vine.string().trim().minLength(1),
  isPublished: vine.boolean(),
  sections: vine.array(
    vine.object({
      id: vine.string().optional(),
      title: vine.string().trim().minLength(1),
      description: vine.string().optional(),
    }),
  ),
  resources: vine.array(vine.string()).optional(),
};

const live = {
  title: vine.string().trim().minLength(1),
  coverImage: vine.string().trim().minLength(1),
  description: vine.string().trim().optional(),
  chapterLimit: vine.number().min(1),
  tags: vine.string().optional(),
  storyType: vine.string().trim().minLength(1),
  chapterType: vine.string().trim().minLength(1),
  sectionType: vine.string().optional(),
  visibility: vine.string().trim().minLength(1),
  isPublished: vine.boolean(),
  sections: vine.array(
    vine.object({
      id: vine.string().optional(),
      title: vine.string().trim().minLength(1),
      description: vine.string().optional(),
    }),
  ),
  resources: vine.array(vine.string()).optional(),
};

const createSchema = {
  title: vine.string().trim().minLength(1),
  coverImage: vine.string().optional(),
  description: vine.string().trim().optional(),
  chapterLimit: vine.number().min(1),
  tags: vine.string().optional(),
  storyType: vine.string().trim().nullable().optional(),
  chapterType: vine.string().trim().nullable().optional(),
  sectionType: vine.string().optional(),
  visibility: vine.string().trim().optional(),
  template: vine.string().trim().minLength(1),
  sections: vine
    .array(
      vine.object({
        id: vine.string().optional(),
        title: vine.string().trim().minLength(1),
        description: vine.string().optional(),
      }),
    )
    .optional(),
  resources: vine.array(vine.string()).optional(),
};

export class StoryCreateValidator {
  validate(data: any): Promise<any> {
    vine.messagesProvider = storyErrorMessages;

    const schema = vine.object({
      bundle: vine.object(createSchema),
    });

    return vine.validate({ schema, data: { bundle: data } });
  }
}

export class StoryUpdateValidator {
  protected isPublished: boolean;

  constructor(
    protected ctx: HttpContext,
    options?: { publishing?: boolean },
  ) {
    this.isPublished =
      options?.publishing === true || ctx.request.input('isPublished') === true;
  }

  validate(data: any): Promise<any> {
    vine.messagesProvider = storyErrorMessages;

    const schema = vine.object({
      bundle: this.effectiveSchema,
    });

    return vine.validate({ schema, data: { bundle: data } });
  }

  protected get effectiveSchema(): SchemaTypes {
    if (!this.isPublished) return vine.object(draft);
    return vine.object(live);
  }
}

export const storyValidationMessages = {
  'bundle.title.minLength': 'Please add a title.',
  'bundle.title.required': 'Please add a title.',
  'bundle.coverImage.minLength': 'Please add a cover image.',
  'bundle.coverImage.required': 'Please add a cover image.',
  'bundle.chapterLimit.number': 'Please enter at least 1 chapter.',
  'bundle.chapterLimit.min': 'Please enter at least 1 chapter.',
  'bundle.chapterLimit.required': 'Please enter at least 1 chapter.',
  'bundle.storyType.minLength': 'Please choose a story type.',
  'bundle.storyType.required': 'Please choose a story type.',
  'bundle.sectionType.minLength': 'Please choose a section type.',
  'bundle.sectionType.required': 'Please choose a section type.',
  'bundle.chapterType.minLength': 'Please choose a chapter type.',
  'bundle.chapterType.required': 'Please choose a chapter type.',
  'bundle.visibility.minLength': 'Please choose a visibility.',
  'bundle.visibility.required': 'Please choose a visibility.',
  'bundle.sections.*.title.minLength': 'Please add a section title.',
  'bundle.sections.*.title.required': 'Please add a section title.',
  'bundle.template.minLength': 'Please choose a chapter template.',
  'bundle.template.required': 'Please choose a chapter template.',
};

export const storyErrorMessages = new SimpleMessagesProvider(storyValidationMessages);
