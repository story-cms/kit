import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import type {
  IndexItem,
  StorySpecifier,
  StoryVersion,
  DraftMeta,
  JSON,
} from '../../types';

export default class Draft extends BaseModel {
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
  declare storyId: number;

  @column()
  declare feedback: string;

  @column()
  declare status: string;

  @column()
  declare updatedBy: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  public get index(): IndexItem {
    return {
      number: this.number,
      title: this.bundle['title'] as string,
      imageUrl: this.bundle['imageUrl'] as string,
    };
  }

  public get specifier(): StorySpecifier {
    return {
      storyId: this.storyId,
      locale: this.locale,
      apiVersion: this.apiVersion,
      number: this.number,
    };
  }

  public get version(): StoryVersion {
    return {
      storyId: this.storyId,
      locale: this.locale,
      apiVersion: this.apiVersion,
    };
  }

  public get meta(): DraftMeta {
    return {
      id: this.id,
      number: this.number,
      status: this.status,
      updatedAt: this.updatedAt.toString(),
      createdAt: this.createdAt.toString(),
    };
  }
}
