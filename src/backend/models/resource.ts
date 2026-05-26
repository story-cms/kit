import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import type { JSON, ResourceBundle } from '../../types.js';

const parseJsonColumn = <T>(value: T | string | null | undefined, fallback: T): T => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return JSON.parse(value) as T;
  return value;
};

const prepareJsonColumn = <T>(value: T | null | undefined) => JSON.stringify(value ?? {});

export default class Resource extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare locale: string;

  @column()
  declare isPublished: boolean;

  @column()
  declare visibility: string;

  @column()
  declare title: string;

  @column()
  declare description: string | null;

  @column()
  declare imageUrl: string | null;

  @column()
  declare label: string | null;

  @column()
  declare type: string;

  @column({
    prepare: (value) => prepareJsonColumn(value),
    consume: (value) => parseJsonColumn(value, {} as JSON<ResourceBundle>),
  })
  declare bundle: JSON<ResourceBundle>;

  @column()
  declare updatedBy: number | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
