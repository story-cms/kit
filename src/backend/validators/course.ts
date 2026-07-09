import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import type { CourseFieldsOptions } from '../define_config.js';
import videoRule from '../validators/video_rule.js';
import type { ValidatorType } from '../../types';

vine.convertEmptyStringsToNull = true;

const videoSchema = vine
  .object({
    url: vine.string(),
  })
  .use(videoRule(null));

const screenSchema = vine.object({
  screenName: vine.string(),
  displayTitle: vine.string().optional(),
  heroImage: vine.string().optional(),
  sessionVideo: videoSchema.optional(),
  bodyText: vine.string().optional(),
  screenStyle: vine.string().optional(),
});

export class CourseValidator implements ValidatorType {
  #hasSections: boolean;

  constructor(options: CourseFieldsOptions = {}) {
    this.#hasSections = options.hasSections === true;
  }

  validate(data: any): Promise<any> {
    vine.messagesProvider = new SimpleMessagesProvider({
      'bundle.title.required': 'The chapter must have a title',
      'bundle.section.required': 'The chapter must have a section',
      'bundle.imageUrl.required': 'The chapter must have a cover image',
      'bundle.screens.required': 'The chapter must have at least one screen',
      'bundle.screens.*.screenName.required': 'Each screen must have a name',
      'bundle.screens.*.sessionVideo.videoSchema': 'Please upload a valid video file',
    });

    const schema = vine.create({
      bundle: vine.object({
        title: vine.string(),
        ...(this.#hasSections ? { section: vine.string() } : {}),
        imageUrl: vine.string(),
        screens: vine.array(screenSchema).minLength(1),
      }),
    });

    return schema.validate(data);
  }
}
