import vine, { SimpleMessagesProvider } from '@vinejs/vine';
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
  validate(data: any): Promise<any> {
    vine.messagesProvider = new SimpleMessagesProvider({
      'bundle.title.required': 'The chapter must have a title',
      // TODO(sections): re-enable when spec is ready
      // 'bundle.section.required': 'The chapter must have a section',
      'bundle.screens.required': 'The chapter must have at least one screen',
      'bundle.screens.*.screenName.required': 'Each screen must have a name',
      'bundle.screens.*.sessionVideo.videoSchema': 'Please upload a valid video file',
    });

    const schema = vine.create({
      bundle: vine.object({
        title: vine.string(),
        // TODO(sections): re-enable when spec is ready
        // section: vine.string(),
        imageUrl: vine.string().optional(),
        screens: vine.array(screenSchema).minLength(1),
      }),
    });

    return schema.validate(data);
  }
}
