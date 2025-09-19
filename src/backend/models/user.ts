import { DateTime } from 'luxon';
import { compose } from '@adonisjs/core/helpers';
import { BaseModel, column, computed } from '@adonisjs/lucid/orm';
import hash from '@adonisjs/core/services/hash';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import type { UserMeta } from '../../types';

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
});

export default class User extends compose(BaseModel, AuthFinder) {
  public static roles = ['admin', 'editor'] as const;

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare email: string;

  @column({ serializeAs: null })
  declare password: string;

  @column()
  declare language: string | null;

  @column({ serializeAs: null })
  declare rememberMeToken?: string;

  @column({ serializeAs: null })
  declare resetToken?: string;

  @column({ serializeAs: null })
  declare resetTokenCreatedAt?: DateTime;

  @column()
  declare role: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  public defaultLanguage(storySourceLanguage: string = 'en'): string {
    if (this.language === '*' || this.language === null) return storySourceLanguage;

    return this.language!;
  }

  @computed()
  public get isManager(): boolean {
    return this.language === '*';
  }

  @computed()
  public get isAdmin(): boolean {
    return this.role === 'admin';
  }

  public isAllowed(locale: string): boolean {
    return this.language === '*' || this.language === locale;
  }

  @computed()
  public get initials(): string {
    const parts = this.name
      .trim()
      .split(' ')
      .map((part) => part.trim().charAt(0));

    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]}${parts[1]}`;
    return `${parts[0]}${parts[parts.length - 1]}`;
  }

  @computed()
  public get hasPendingInvite(): boolean {
    // not null or empty
    if (!this.resetToken) return false;

    return this.resetToken?.trim().length > 3;
  }

  @computed()
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
