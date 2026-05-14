import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import type { JSON, StoryResource, StorySection } from '../../types';

export default class StoryLocalisation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare locale: string;

  @column()
  declare storyId: number;

  @column()
  declare title: string;

  @column()
  declare coverImage: string;

  @column()
  declare description: string;

  @column()
  declare sections: JSON<StorySection[]>;

  @column()
  declare resources: JSON<StoryResource[]>;

  @column()
  declare updatedBy: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
