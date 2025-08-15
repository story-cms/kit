import factory from '@adonisjs/lucid/factories';
import Drop from '../models/drop.js';
import { DateTime } from 'luxon';

export const DropFactory = factory
  .define(Drop, async ({ faker }) => {
    return {
      apiVersion: 1,
      streamId: 1,
      releaseAt: DateTime.now(),
      isPublished: true,
      title: faker.lorem.sentence(),
      coverImage: faker.image.url(),
    };
  })
  .build();
