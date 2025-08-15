import { StorySpec } from '../../types';
import BundleService from '../services/bundle_service.js';
import vine, { SimpleMessagesProvider, VineValidator } from '@vinejs/vine';

export class ChapterValidator {
  constructor(protected story: StorySpec) {}

  public get schema(): VineValidator<any, Record<string, any> | undefined> {
    const service = new BundleService(this.story.fields);
    const schema = service.getValidationBuilder(false);

    return vine.compile(
      vine.object({
        bundle: vine.object(schema),
      }),
    );
  }
}

export const chapterErrorMessages = new SimpleMessagesProvider({
  'bundle.title.required': 'We must have a title',
});
