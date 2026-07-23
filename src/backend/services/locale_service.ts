import Story from '../models/story.js';
import { parseLanguageSpecification } from '../../shared/language_helpers.js';
import type { CmsConfig, LocaleItem, LocaleStoriesResponse } from '../../types.js';

export class LocaleService {
  public constructor(protected readonly config: CmsConfig) {}

  public async storiesByLocale(): Promise<LocaleStoriesResponse> {
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

    const content = locales
      .map((locale) => ({ locale, stories: byLocale.get(locale) ?? [] }))
      .filter((item) => item.stories.length > 0);

    const languagesByLocale = new Map(
      this.config.languages.map((language) => [language.locale, language]),
    );

    const app: LocaleItem[] = content.map(({ locale }) => {
      const spec = languagesByLocale.get(locale)!;
      return parseLanguageSpecification(spec);
    });

    return { content, app };
  }
}
