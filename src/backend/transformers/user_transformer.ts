import type User from '../models/user';
import { BaseTransformer } from '@adonisjs/core/transformers';

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return this.pick(this.resource, ['id', 'name', 'isAdmin', 'isManager', 'role']);
  }

  /**
   * Detailed variant for showing a single post
   * Includes the full content with markdown converted to HTML
   */
  async forUsersTable() {
    return {
      ...this.pick(this.resource, [
        'id',
        'name',
        'email',
        'role',
        'language',
        'initials',
        'hasPendingInvite',
      ]),
      lastActivity: null as string | null,
    };
  }
}
