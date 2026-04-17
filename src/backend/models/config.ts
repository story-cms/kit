import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class Config extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare key: string;

  @column()
  declare version: number;

  @column()
  declare data: Record<string, any>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
