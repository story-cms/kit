import factory from '@adonisjs/lucid/factories';
import Resource from '../models/resource.js';
import type { LinkBundle, TextBundle, VideoBundle } from '../../types.js';

export const ResourceFactory = factory
  .define(Resource, async ({ faker }) => {
    return {
      locale: 'en',
      isPublished: true,
      visibility: 'public',
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      imageUrl: faker.image.url(),
      label: null,
      type: 'text',
      bundle: { content: faker.lorem.paragraphs(2) } satisfies TextBundle,
      updatedBy: null,
    };
  })
  .state('text', (resource) => {
    resource.type = 'text';
    resource.label = null;
    resource.bundle = {
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    } satisfies TextBundle;
  })
  .state('video', (resource) => {
    resource.type = 'video';
    resource.label = 'Watch video';
    resource.bundle = {
      video: { url: 'https://example.com/video.mp4' },
    } satisfies VideoBundle;
  })
  .state('info_link', (resource) => {
    resource.type = 'info_link';
    resource.label = 'Learn more';
    resource.bundle = {
      infoUrl: 'https://example.com/info',
    } satisfies LinkBundle;
  })
  .build();

// const resource = await ResourceFactory.apply('video').create();
