import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import type { ValidatorType } from '../../types.js';
import {
  chapterBlockErrorMessages,
  chapterBlockSchema,
  requiredString,
} from './chapter_blocks_validator.js';

export const courseDraftErrorMessages = new SimpleMessagesProvider({
  'bundle.number.required': 'The session must have a number',
  'bundle.number.minLength': 'The session must have a number',
  'bundle.title.required': 'The session must have a title',
  'bundle.title.minLength': 'The session must have a title',
  'bundle.blocks.required': 'The session must have at least one block',
  'bundle.blocks.minLength': 'The session must have at least one block',
  ...chapterBlockErrorMessages,
});

export class CourseValidator implements ValidatorType {
  validate(data: any): Promise<any> {
    vine.messagesProvider = courseDraftErrorMessages;

    const schema = vine.create({
      bundle: vine.object({
        number: requiredString(),
        title: requiredString(),
        description: vine.string().optional(),
        coverImage: vine.string().optional(),
        blocks: vine.array(chapterBlockSchema({ includeScriptureBlock: false })).minLength(1),
        resources: vine.array(vine.string().uuid()).optional(),
      }),
    });

    return schema.validate(data);
  }
}
