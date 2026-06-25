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
  description: vine.string().trim().minLength(1),
  chapterLimit: vine.number().min(1),
  tags: vine.string().optional(),
  storyType: vine.string().trim().minLength(1),
  chapterType: vine.string().trim().minLength(1),
  sectionType: vine.string().optional(),
  visibility: vine.string().trim().minLength(1),
  template: vine.string().trim().minLength(1),
};

export class StoryCreateValidator {
  validate(data: any): Promise<any> {
    vine.messagesProvider = new SimpleMessagesProvider({
      ...storyErrorMessages,
      'bundle.template.minLength': 'Choose a content shape for the story',
    });

    const schema = vine.object({
      bundle: vine.object(createSchema),
    });

    return vine.validate({ schema, data: { bundle: data } });
  }
}

export class StoryUpdateValidator {
  protected isPublished: boolean;

  constructor(protected ctx: HttpContext) {
    this.isPublished = ctx.request.input('isPublished') === true;
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

export const storyErrorMessages = new SimpleMessagesProvider({
  'bundle.title.minLength': 'Your story must have a title',
  'bundle.coverImage.minLength': 'Your story must have a cover image',
  'bundle.description.minLength': 'Your story must have a description',
  'bundle.chapterLimit.number': 'The chapter limit must be a number',
  'bundle.chapterLimit.min': 'The chapter limit must be a number greater than 0',
  'bundle.storyType.minLength': 'How about "Story"? We need to call it something.',
  'bundle.sectionType.minLength': 'Shall we just use "Section" then?',
  'bundle.chapterType.minLength': 'Choose something like "Session", "Lesson", "Episode"',
  'bundle.visibility.minLength': 'Choose the visibility of the story',
  'bundle.sections.*.title.minLength': 'A section must have a title',
  'bundle.template.minLength': 'Choose a content shape for the story',
});
