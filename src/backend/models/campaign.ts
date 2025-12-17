import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import type { CampaignBundle, CampaignMeta } from '../../types';

export default class Campaign extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare apiVersion: number;

  @column()
  declare locale: string;

  @column()
  declare isPublished: boolean;

  @column()
  declare bundle: Record<string, any>;

  @column()
  declare stats: Record<string, any>;

  @column()
  declare updatedBy: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  public get model() {
    return {
      ...this.bundle,
      id: this.id,
      isPublished: this.isPublished,
    };
  }

  public updateBundle(changes: any) {
    const old = this.bundle;
    const fresh = <CampaignBundle>{
      name: this.freshValue(changes, old, 'name', ''),
      window: this.freshValue(changes, old, 'window', ''),
      promoImage: this.freshValue(changes, old, 'promoImage', ''),
      title: this.freshValue(changes, old, 'title', ''),
      message: this.freshValue(changes, old, 'message', ''),
      actionLabel: this.freshValue(changes, old, 'actionLabel', ''),
      actionType: this.freshValue(changes, old, 'actionType', ''),
      actionUrl: this.freshValue(changes, old, 'actionUrl', ''),
      regions: this.freshValue(changes, old, 'regions', ''),
    };

    this.bundle = fresh;
  }

  protected freshValue(
    changes: Record<string, any>,
    old: Record<string, any>,
    key: string,
    fallback: string | number,
  ): string | number {
    if (changes[key] !== undefined) return changes[key];
    if (old[key] !== undefined) return old[key];
    return fallback;
  }

  public get meta(): CampaignMeta {
    return {
      id: this.id,
      createdAt: this.createdAt.toString(),
      updatedAt: this.updatedAt.toString(),
    };
  }
}
