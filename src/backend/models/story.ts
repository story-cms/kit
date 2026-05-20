import { DateTime } from 'luxon';
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import type { HasMany } from '@adonisjs/lucid/types/relations';
import StoryLocalisation from './story_localisation.js';
import { StoryFunctional } from '../../types.js';

export default class Story extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare tags: string;

  @column()
  declare chapterLimit: number;

  @column()
  declare storyType: string;

  @column()
  declare chapterType: string;

  @column()
  declare sectionType: string;

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
  declare updatedAt: DateTime;

  @hasMany(() => StoryLocalisation)
  declare localisations: HasMany<typeof StoryLocalisation>;

  public get functional(): StoryFunctional {
    return {
      id: this.id,
      tags: this.tags,
      chapterLimit: this.chapterLimit,
      storyType: this.storyType,
      chapterType: this.chapterType,
      sectionType: this.sectionType,
      visibility: this.visibility,
      slug: this.slug,
      template: this.template,
      order: this.order,
      isPublished: this.isPublished,
      createdAt: this.createdAt.toString(),
      updatedAt: this.updatedAt.toString(),
    };
  }
}
