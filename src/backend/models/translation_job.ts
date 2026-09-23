import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export type TranslationJobStatus = 'pending' | 'processing' | 'complete' | 'failed';

export default class TranslationJob extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare storyId: number;

  @column()
  declare draftId: number;

  @column()
  declare locale: string;

  @column()
  declare chapterTitle: string;

  @column()
  declare userId: number;

  // input+output estimate at dispatch time; reserved against the locale
  // balance while pending/processing (see ChapterTranslationService.getBalance).
  @column()
  declare estimatedTokens: number;

  @column()
  declare status: TranslationJobStatus;

  // The draft bundle as it was right before this translation overwrote it,
  // captured once the job starts processing. Enables a future undo action.
  @column()
  declare previousBundle: Record<string, unknown> | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
