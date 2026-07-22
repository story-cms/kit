import Story from '../models/story.js';
import type { CmsConfig, LocaleStoriesResponse } from '../../types.js';

export class LocaleService {
  public constructor(protected readonly config: CmsConfig) {}

  public async availableStories(): Promise<LocaleStoriesResponse> {
    const locales = this.config.languages.map((language) => language.locale);

    const stories = await Story.query()
      .select('id', 'slug', 'order')
      .preload('localisations', (query) => {
        query.where('isPublished', true).whereIn('locale', locales);
      })
      .whereHas('localisations', (query) => {
        query.where('isPublished', true).whereIn('locale', locales);
      })
      .orderBy('order', 'asc');

    const byLocale = new Map(locales.map((locale) => [locale, [] as string[]]));

    for (const story of stories) {
      for (const localisation of story.localisations) {
        byLocale.get(localisation.locale)?.push(story.slug);
      }
    }

    return {
      content: locales
        .map((locale) => ({ locale, stories: byLocale.get(locale) ?? [] }))
        .filter((item) => item.stories.length > 0),
    };
  }
}
