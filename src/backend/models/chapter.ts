import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import { IndexItem, Specifier, ChapterMeta } from '../../types';

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
  declare bundle: string;

  @column()
  declare updatedBy: number;

  @column()
  declare storyId: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  public get parsedBundle(): Record<string, unknown> {
    const start = typeof this.bundle === 'string' ? JSON.parse(this.bundle) : this.bundle;
    return start;
  }

  public get escapedBundle() {
    const start =
      typeof this.bundle === 'string' ? this.bundle : JSON.stringify(this.bundle);
    const cleaned = start.replace(/\u00A0/g, '\\\\u00A0');
    const parsed = JSON.parse(cleaned);
    return parsed;
  }

  public get index(): IndexItem {
    return {
      number: this.number,
      title: this.parsedBundle['title'] as string,
      imageUrl: this.parsedBundle['imageUrl'] as string,
    };
  }

  public get specifier(): Specifier {
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
