import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DropIndexItem, DropMeta, JSON } from '../../types';

export default class Drop extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare apiVersion: number;

  @column()
  declare streamId: number;

  @column()
  declare releaseAt: DateTime | null;

  @column()
  declare isPublished: boolean;

  @column()
  declare title: string;

  @column()
  declare coverImage: string;

  @column()
  declare bundle: JSON<any>;

  @column()
  declare updatedBy: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  public get model() {
    return {
      id: this.id,
      isPublished: this.isPublished,
      title: this.title,
      coverImage: this.coverImage,
      releaseAt: this.releaseAt,
      ...this.bundle,
    };
  }

  public get indexItem(): DropIndexItem {
    return {
      id: this.id,
      title: this.title,
      coverImage: this.coverImage,
      releaseAt: this.releaseAt?.toString() ?? '',
      isPublished: this.isPublished,
    };
  }

  public get meta(): Omit<DropMeta, 'updatedBy'> {
    return {
      id: this.id,
      createdAt: this.createdAt.toString(),
      updatedAt: this.updatedAt.toString(),
    };
  }
}
