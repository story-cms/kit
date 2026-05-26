import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import type { IndexItem, StorySpecifier, ChapterMeta, JSON } from '../../types';

export default class Chapter extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare apiVersion: number;

  @column()
  declare locale: string;

  @column()
  declare number: number;

  @column()
  declare bundle: JSON<any>;

  @column()
  declare updatedBy: number;

  @column()
  declare storyId: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  public get escapedBundle(): JSON<any> {
    const start = JSON.stringify(this.bundle);
    const cleaned = start.replace(/\u00A0/g, '\\\\u00A0');
    const parsed = JSON.parse(cleaned);
    return parsed;
  }

  public get index(): IndexItem {
    return {
      number: this.number,
      title: this.bundle['title'] as string,
      imageUrl: this.bundle['imageUrl'] as string,
    };
  }

  public get specifier(): StorySpecifier {
    return {
      apiVersion: this.apiVersion,
      locale: this.locale,
      number: this.number,
      storyId: this.storyId,
    };
  }

  public get meta(): ChapterMeta {
    return {
      number: this.number,
      createdAt: this.createdAt.toString(),
      updatedAt: this.updatedAt.toString(),
    };
  }
}
