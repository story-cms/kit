import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class Preference extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare settings: string | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  public get parsedSettings(): Record<string, any> {
    try {
      if (!this.settings || this.settings === null || this.settings === '') {
        return {};
      }
      return typeof this.settings === 'string'
        ? JSON.parse(this.settings)
        : this.settings;
    } catch {
      return {};
    }
  }

  public setSettings(settings: Record<string, any>): void {
    this.settings = JSON.stringify(settings);
  }

  public getSetting(key: string, defaultValue: any = null): any {
    const settings = this.parsedSettings;
    return settings[key] !== undefined ? settings[key] : defaultValue;
  }

  public setSetting(key: string, value: any): void {
    const settings = this.parsedSettings;
    settings[key] = value;
    this.setSettings(settings);
  }

  public removeSetting(key: string): void {
    const settings = this.parsedSettings;
    delete settings[key];
    this.setSettings(settings);
  }
}
