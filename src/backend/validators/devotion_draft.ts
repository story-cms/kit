import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import type { ValidatorType } from '../../types.js';
import audioRule from './audio_rule.js';
import {
  chapterBlockErrorMessages,
  chapterBlockSchema,
  requiredString,
} from './chapter_blocks_validator.js';

const devotionAudioSchema = vine
  .object({
    url: vine.string().nullable(),
    length: vine.number().nullable(),
  })
  .use(audioRule({ canBeEmpty: true }))
  .optional();

export const devotionDraftErrorMessages = new SimpleMessagesProvider({
  'bundle.number.required': 'The devotion must have a number',
  'bundle.number.minLength': 'The devotion must have a number',
  'bundle.title.required': 'The devotion must have a title',
  'bundle.title.minLength': 'The devotion must have a title',
  'bundle.blocks.required': 'The devotion must have at least one block',
  'bundle.blocks.minLength': 'The devotion must have at least one block',
  ...chapterBlockErrorMessages,
});

export class DevotionDraftValidator implements ValidatorType {
  validate(data: any): Promise<any> {
    vine.messagesProvider = devotionDraftErrorMessages;

    const schema = vine.create({
      bundle: vine.object({
        number: requiredString(),
        title: requiredString(),
        description: vine.string().optional(),
        coverImage: vine.string().optional(),
        devotionAudio: devotionAudioSchema,
        blocks: vine.array(chapterBlockSchema()).minLength(1),
        resources: vine.array(vine.string().uuid()).optional(),
      }),
    });

    return schema.validate(data);
  }
}
