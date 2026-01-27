import factory from '@adonisjs/lucid/factories';
import Campaign from '../models/campaign.js';

export const CampaignFactory = factory
  .define(Campaign, async ({ faker }) => {
    const startDate = faker.date.future();
    const endDate = faker.date.future({ refDate: startDate });
    const window = `${startDate.toISOString()}|${endDate.toISOString()}`;

    const bundle = {
      name: faker.company.name(),
      window: window,
      promoImage: faker.image.url(),
      title: faker.lorem.sentence(),
      message: faker.lorem.paragraph(),
      actionLabel: faker.lorem.words(2),
      actionType: faker.helpers.arrayElement(['close', 'donate', 'externalUrl']),
      actionUrl: faker.internet.url(),
      regions: faker.location.countryCode(),
    };

    return {
      apiVersion: 1,
      locale: 'en',
      bundle: bundle,
      isPublished: true,
      stats: {},
    };
  })
  .build();
