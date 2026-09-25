import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class Allocation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare locale: string;

  @column()
  declare tokens: number;

  @column()
  declare userId: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
