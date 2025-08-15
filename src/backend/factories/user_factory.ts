import factory from '@adonisjs/lucid/factories';
import User from '../models/user.js';

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      language: '*',
      password: 'secret',
      role: 'editor',
    };
  })
  .build();
