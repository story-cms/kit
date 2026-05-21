import { BaseTransformer } from '@adonisjs/core/transformers';
import Story from '../models/story';
import { emptyTranslation } from '../models/story_localisation';

export class StoryTransformer extends BaseTransformer<Story> {
  toObject() {
    return this.omit(this.resource, ['order', 'localisations']);
  }

  forStoryEdit() {
    const target =
      this.resource.localisations.find(
        (localisation) => localisation.locale === this.resource.$sideloaded.targetLocale,
      ) ?? emptyTranslation;
    const source =
      this.resource.localisations.find(
        (localisation) => localisation.locale === this.resource.$sideloaded.sourceLocale,
      ) ?? emptyTranslation;
    return {
      model: {
        ...this.pick(this.resource, [
          'id',
          'tags',
          'chapterLimit',
          'storyType',
          'chapterType',
          'sectionType',
          'visibility',
          'slug',
          'template',
          'isPublished',
          'createdAt',
          'updatedAt',
        ]),
        ...this.pick(target, [
          'title',
          'coverImage',
          'description',
          'sections',
          'resources',
        ]),
      },
      source: {
        ...this.pick(source, [
          'title',
          'coverImage',
          'description',
          'sections',
          'resources',
        ]),
      },
    };
  }
}
