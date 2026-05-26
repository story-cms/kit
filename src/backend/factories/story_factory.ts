import factory from '@adonisjs/lucid/factories';
import Story from '../models/story.js';
import { StoryLocalisationFactory } from './story_localisation_factory.js';

export const StoryFactory = factory
  .define(Story, async ({ faker }) => {
    return {
      tags: faker.lorem.words(3).split(' ').join(','),
      chapterLimit: 10,
      storyType: 'Story',
      chapterType: 'Chapter',
      sectionType: 'Section',
      visibility: 'public',
      slug: faker.lorem.slug(),
      template: 'devotion',
      order: faker.number.int(10),
      isPublished: true,
    };
  })
  .relation('localisations', () => StoryLocalisationFactory)
  .build();

// const story = await StoryFactory.with('localisations')
//   .with('localisations', (localisation) => localisation.apply('german'))
//   .create();
