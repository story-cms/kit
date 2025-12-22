import factory from '@adonisjs/lucid/factories';
import Campaign from '../models/campaign.js';

export const CampaignFactory = factory
  .define(Campaign, async ({ faker }) => {
    return {
      apiVersion: 1,
      locale: 'en',
      isPublished: true,
      stats: {},
      bundle: {
        name: faker.lorem.sentence(),
        window: '',
        title: faker.lorem.words(3),
        message: faker.lorem.paragraph(),
        actionLabel: faker.lorem.words(1),
        actionType: faker.helpers.arrayElement(['close', 'donate', 'externalUrl']),
        actionUrl: '',
      },
    };
  })
  .build();
