import factory from '@adonisjs/lucid/factories';
import StoryLocalisation from '../models/story_localisation.js';
import type { StorySection } from '../../types.js';

export const StoryLocalisationFactory = factory
  .define(StoryLocalisation, async ({ faker }) => {
    return {
      locale: 'en',
      // storyId: 1,
      isPublished: true,
      title: faker.lorem.sentence(),
      coverImage: faker.image.url(),
      description: faker.lorem.paragraph(),
      tags: faker.lorem.words(3).split(' ').join(','),
      sections: [
        {
          id: faker.string.uuid(),
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
        } as StorySection,
      ],
      resources: [faker.string.uuid()],
      // Avoid FK violations in tests where `users.id=1` may not exist.
      // `updated_by` is nullable at the DB level.
      updatedBy: null,
    };
  })
  .state('german', (storyLocalisation) => {
    storyLocalisation.locale = 'de';
  })
  .build();
