import factory from '@adonisjs/lucid/factories';
import StoryLocalisation from '../models/story_localisation.js';
import type { StoryResource, StorySection } from '../../types.js';

export const StoryLocalisationFactory = factory
  .define(StoryLocalisation, async ({ faker }) => {
    return {
      locale: 'en',
      // storyId: 1,
      title: faker.lorem.sentence(),
      coverImage: faker.image.url(),
      description: faker.lorem.paragraph(),
      sections: [
        {
          id: faker.string.uuid(),
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
        } as StorySection,
      ],
      resources: [
        {
          id: faker.string.uuid(),
          title: faker.lorem.sentence(),
          type: 'image',
          visibility: 'public',
          url: faker.internet.url(),
          label: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          imageUrl: faker.image.url(),
        } as StoryResource,
      ],
      // Avoid FK violations in tests where `users.id=1` may not exist.
      // `updated_by` is nullable at the DB level.
      updatedBy: null,
    };
  })
  .state('german', (storyLocalisation) => {
    storyLocalisation.locale = 'de';
  })
  .build();
