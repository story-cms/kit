import factory from '@adonisjs/lucid/factories';
import Chapter from '../models/chapter.js';

export const ChapterFactory = factory
  .define(Chapter, async () => {
    return {
      apiVersion: 1,
      locale: 'en',
      number: 1,
      bundle: '{}',
      storyId: 1,
    };
  })
  .build();
