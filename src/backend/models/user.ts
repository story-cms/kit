import type { UserMeta } from '../../types';
import { UserSchema } from './schema.js';
import hash from '@adonisjs/core/services/hash';
import { compose } from '@adonisjs/core/helpers';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';

export default class User extends compose(UserSchema, withAuthFinder(() => hash.use())) {
  public defaultLanguage(storySourceLanguage: string = 'en'): string {
    if (this.language === '*' || this.language === null) return storySourceLanguage;

    return this.language!;
  }

  public get isManager(): boolean {
    return this.language === '*';
  }

  public get isAdmin(): boolean {
    return this.role === 'admin';
  }

  public isAllowed(locale: string): boolean {
    return this.language === '*' || this.language === locale;
  }

  public get initials(): string {
    const parts = this.name
      .trim()
      .split(' ')
      .map((part) => part.trim().charAt(0));

    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]}${parts[1]}`;
    return `${parts[0]}${parts[parts.length - 1]}`;
  }

  public get hasPendingInvite(): boolean {
    // not null or empty
    if (!this.resetToken) return false;

    return this.resetToken?.trim().length > 3;
  }

  public get meta(): UserMeta {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      language: this.language,
      initials: this.initials,
      hasPendingInvite: this.hasPendingInvite,
      lastActivity: null,
    };
  }
}
