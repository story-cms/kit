import factory from '@adonisjs/lucid/factories';
import Index from '../models/index.js';

export const IndexFactory = factory
  .define(Index, async () => {
    return {
      apiVersion: 1,
      locale: 'en',
      draftsList: [],
      publishedList: [],
      issuesList: [],
      items: { root: [] },
      storyId: 1,
    };
  })
  .build();
