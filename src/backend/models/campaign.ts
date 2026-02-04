import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import type { CampaignBundle, CampaignMeta, CampaignForApi } from '../../types';

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

  public get forApi(): CampaignForApi {
    const [start, end] = this.splitWindow;
    return {
      id: this.id,
      startDate: start?.toISO() ?? null,
      endDate: end?.toISO() ?? null,
      promoImage: this.bundle.promoImage,
      videoUrl: this.bundle.videoUrl,
      title: this.bundle.title,
      message: this.bundle.message,
      actionLabel: this.bundle.actionLabel,
      actionType: this.bundle.actionType,
      actionUrl: this.bundle.actionUrl,
      regions: this.bundle.regions,
    };
  }

  public get splitWindow(): [DateTime | null, DateTime | null] {
    const parseDate = (dateStr: string | undefined): DateTime | null => {
      if (!dateStr) return null;
      const dt = DateTime.fromISO(dateStr, { zone: 'utc' });
      return dt.isValid ? dt.toUTC() : null;
    };

    if (!this.bundle || !this.bundle.window) return [null, null];
    const [start, end] = this.bundle.window.split('|');

    const startDate = start?.trim();
    const endDate = end?.trim();

    return [parseDate(startDate), parseDate(endDate)];
  }

  public updateBundle(changes: any) {
    const old = this.bundle;
    const fresh = <CampaignBundle>{
      name: this.freshValue(changes, old, 'name', ''),
      window: this.freshValue(changes, old, 'window', ''),
      promoImage: this.freshValue(changes, old, 'promoImage', ''),
      videoUrl: this.freshValue(changes, old, 'videoUrl', ''),
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
