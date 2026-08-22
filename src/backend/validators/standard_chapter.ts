import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import type { SchemaTypes } from '@vinejs/vine/types';
import type { StandardChapterExtraField } from '../../shared/standard_chapter.js';
import {
  standardChapterTemplate,
  isStandardChapterTemplate,
  type StandardChapterTemplate,
} from '../../shared/standard_chapter.js';
import type { ValidatorType } from '../../types.js';
import audioRule from './audio_rule.js';
import {
  chapterBlockErrorMessages,
  chapterBlockSchema,
  requiredString,
} from './chapter_blocks_validator.js';

const extraFieldSchemas: Record<StandardChapterExtraField, SchemaTypes> = {
  devotionAudio: vine
    .object({
      url: vine.string().nullable(),
      length: vine.number().nullable(),
    })
    .use(audioRule({ canBeEmpty: true }))
    .optional(),
};

const chapterNoun = (chapterType?: string | null): string => {
  const noun = chapterType?.trim().toLowerCase();
  return noun || 'chapter';
};

const extraFieldSchema = (spec: StandardChapterTemplate): Record<string, SchemaTypes> =>
  Object.fromEntries(spec.extraFields.map((field) => [field, extraFieldSchemas[field]]));

export class StandardChapterValidator implements ValidatorType {
  readonly spec: StandardChapterTemplate;
  readonly noun: string;

  constructor(template: string, chapterType?: string | null) {
    const spec = standardChapterTemplate(template);
    if (!spec) {
      throw new Error(`Unknown standard chapter template: ${template}`);
    }

    this.spec = spec;
    this.noun = chapterNoun(chapterType);
  }

  validate(data: unknown): Promise<any> {
    vine.messagesProvider = new SimpleMessagesProvider({
      'bundle.number.required': `The ${this.noun} must have a number`,
      'bundle.number.minLength': `The ${this.noun} must have a number`,
      'bundle.title.required': `The ${this.noun} must have a title`,
      'bundle.title.minLength': `The ${this.noun} must have a title`,
      'bundle.blocks.required': `The ${this.noun} must have at least one block`,
      'bundle.blocks.array.minLength': `The ${this.noun} must have at least one block`,
      ...chapterBlockErrorMessages,
    });

    const schema = vine.create({
      bundle: vine.object({
        number: requiredString(),
        title: requiredString(),
        description: vine.string().optional(),
        coverImage: vine.string().optional(),
        ...extraFieldSchema(this.spec),
        blocks: vine
          .array(chapterBlockSchema({ includeScriptureBlock: this.spec.includeScriptureBlock }))
          .minLength(1),
        resources: vine.array(vine.string().uuid()).optional(),
      }),
    });

    return schema.validate(data);
  }
}

export const standardChapterValidator = (story: {
  template?: string | null;
  chapterType?: string | null;
}): StandardChapterValidator | undefined => {
  if (!isStandardChapterTemplate(story.template)) return undefined;
  return new StandardChapterValidator(story.template, story.chapterType);
};
