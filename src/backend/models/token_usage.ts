import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class TokenUsage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare storyId: number;

  @column()
  declare draftId: number;

  @column()
  declare locale: string;

  @column()
  declare translationJobId: number | null;

  @column()
  declare inputTokens: number;

  @column()
  declare outputTokens: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
