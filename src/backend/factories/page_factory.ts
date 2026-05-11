import factory from '@adonisjs/lucid/factories';
import Page from '../models/page.js';
import type { PageBundle } from '../../types.js';

export const PageFactory = factory
  .define(Page, async ({ faker }) => {
    const bundle = {
      title: faker.lorem.words(),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      icon: 'https://res.cloudinary.com/kiekies/image/upload/v1676554928/tmwckmf75hvnpabrifqn.svg',
      group: 1,
    };

    return {
      apiVersion: 1,
      locale: 'en',
      order: 1,
      bundle: bundle as PageBundle,
      isPublished: true,
    };
  })
  .build();
