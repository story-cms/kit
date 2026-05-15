import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import type { JSON, StoryResource, StorySection } from '../../types.js';

const parseJsonColumn = <T>(value: T | string | null | undefined, fallback: T): T => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return JSON.parse(value) as T;
  return value;
};

const prepareJsonColumn = <T>(value: T | null | undefined) => JSON.stringify(value ?? []);

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

  @column({
    prepare: (value) => prepareJsonColumn(value),
    consume: (value) => parseJsonColumn(value, [] as JSON<StorySection[]>),
  })
  declare sections: JSON<StorySection[]>;

  @column({
    prepare: (value) => prepareJsonColumn(value),
    consume: (value) => parseJsonColumn(value, [] as JSON<StoryResource[]>),
  })
  declare resources: JSON<StoryResource[]>;

  @column()
  declare updatedBy: number | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
