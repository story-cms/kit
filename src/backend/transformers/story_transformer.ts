import { BaseTransformer } from '@adonisjs/core/transformers';
import Story from '../models/story';
import StoryLocalisation from '../models/story_localisation';
import { StorySpec } from '../../types';

export class StoryTransformer extends BaseTransformer<Story> {
  toObject() {
    return this.omit(this.resource, ['order', 'localisations']);
  }

  asSpec() {
    const localisation = this.resource.localisations[0] ?? emptyLocalisation;
    return {
      ...this.toObject(),
      name: localisation.title,
      coverImage: localisation.coverImage,
      sections: localisation.sections,
      schemaVersion: 1,
      fields: this.resource.$sideloaded.fields,
    } satisfies StorySpec;
  }

  forStoryEdit() {
    const target =
      this.resource.localisations.find(
        (localisation) => localisation.locale === this.resource.$sideloaded.targetlocale,
      ) ?? emptyLocalisation;
    const source =
      this.resource.localisations.find(
        (localisation) => localisation.locale === this.resource.$sideloaded.sourcelocale,
      ) ?? emptyLocalisation;
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

const emptyLocalisation: Partial<StoryLocalisation> = {
  title: '',
  coverImage: '',
  description: '',
  sections: [],
  resources: [],
};

//   localisations: this.resource.localisations.map((localisation) => ({
//   ...this.pick(localisation, ['locale', 'title', 'coverImage', 'description']),
//   sections: localisation.sections,
//   resources: localisation.resources,
// })),
