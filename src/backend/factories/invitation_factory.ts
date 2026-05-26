import factory from '@adonisjs/lucid/factories';
import type { InvitationBundle } from '../../types';
import Invitation from '../models/invitation.js';

export const InvitationFactory = factory
  .define(Invitation, async ({ faker }) => {
    const startDate = faker.date.future();
    const endDate = faker.date.future({ refDate: startDate });
    const window = `${startDate.toISOString()}|${endDate.toISOString()}`;

    const bundle: InvitationBundle = {
      name: faker.company.name(),
      window: window,
      promoImage: faker.image.url(),
      videoUrl: `https://${faker.internet.domainName()}.com/video.mp4`,
      title: faker.lorem.sentence(),
      message: faker.lorem.paragraph(),
      actionLabel: faker.lorem.words(2),
      actionType: faker.helpers.arrayElement([
        'close',
        'donate',
        'externalUrl',
      ]) as InvitationBundle['actionType'],
      actionUrl: faker.internet.url(),
      regions: faker.location.countryCode(),
    };

    return {
      apiVersion: 1,
      locale: 'en',
      bundle: bundle as InvitationBundle,
      isPublished: true,
      stats: {
        impressions: 0,
        clicks: 0,
      },
    };
  })
  .build();
