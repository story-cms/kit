import Preference from '../models/preference.js';
import type { Bookmark } from '../../types';

export class PreferenceService {
  private async getUserPreferences(userId: number): Promise<Preference | null> {
    return await Preference.query().where({ userId }).first();
  }

  async getUserBookmarks(userId: number): Promise<Bookmark[]> {
    const preference = await this.getUserPreferences(userId);

    if (!preference) {
      return [];
    }

    const settings = preference.parsedSettings;
    if (!settings || typeof settings !== 'object') {
      return [];
    }

    return settings.bookmarks || [];
  }

  async toggleBookmark(userId: number, bookmark: Bookmark): Promise<Bookmark[]> {
    let preference = await Preference.query().where({ userId }).first();

    if (!preference) {
      // Create new preferences with the bookmark
      preference = await Preference.create({
        userId,
        settings: JSON.stringify({ bookmarks: [bookmark] }),
      });
      return [bookmark];
    }

    const settings = preference.parsedSettings;
    let bookmarks = settings.bookmarks || [];

    const existingBookmark = bookmarks.find(
      (b: Bookmark) => b.label === bookmark.label && b.link === bookmark.link,
    );

    if (existingBookmark) {
      bookmarks = bookmarks.filter((b: Bookmark) => b.link !== existingBookmark.link);
    } else {
      bookmarks.push(bookmark);
    }

    settings.bookmarks = bookmarks;

    preference.settings = JSON.stringify(settings);
    await preference.save();

    return bookmarks;
  }
}
