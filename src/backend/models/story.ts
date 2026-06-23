import { DateTime } from 'luxon';
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import type { HasMany } from '@adonisjs/lucid/types/relations';
import StoryLocalisation from './story_localisation.js';

export default class Story extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare chapterLimit: number;

  @column()
  declare storyType: string;

  @column()
  declare chapterType: string;

  @column()
  declare sectionType: string | null;

  @column()
  declare visibility: string;

  @column()
  declare slug: string;

  @column()
  declare template: string;

  @column()
  declare order: number;

  @column()
  declare isPublished: boolean;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @hasMany(() => StoryLocalisation)
  declare localisations: HasMany<typeof StoryLocalisation>;
}
