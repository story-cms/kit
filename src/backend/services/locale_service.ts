import Story from '../models/story.js';
import Ui from '../models/ui.js';
import { parseLanguageSpecification } from '../../shared/language_helpers.js';
import { FlagState } from '../../types.js';
import type { CmsConfig, LocaleIndexResponse } from '../../types.js';

const APP_UI_TRANSLATION_THRESHOLD = 0.8;

export class LocaleService {
  public constructor(protected readonly config: CmsConfig) {}

  public get sourceLocale(): string {
    return this.config.languages[0].locale;
  }

  public async localeIndex(): Promise<LocaleIndexResponse> {
    const locales = this.config.languages.map((language) => language.locale);
    const languages = this.config.languages.map(parseLanguageSpecification);

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

    const app = await this.appLocales(locales);

    return {
      languages,
      content,
      app,
      media: [this.sourceLocale],
    };
  }

  private async appLocales(locales: string[]): Promise<string[]> {
    const sourceLocale = this.sourceLocale;
    const rows = await Ui.query().whereIn('locale', locales);
    const totalUiCount = rows.filter((row) => row.locale === sourceLocale).length;

    const app = [sourceLocale];

    if (totalUiCount === 0) {
      return app;
    }

    for (const locale of locales) {
      if (locale === sourceLocale) {
        continue;
      }

      const translatedCount = rows.filter(
        (row) =>
          row.locale === locale &&
          row.microCopy &&
          row.microCopy.trim() !== '' &&
          row.flag !== FlagState.PREFILLED,
      ).length;

      if (translatedCount / totalUiCount > APP_UI_TRANSLATION_THRESHOLD) {
        app.push(locale);
      }
    }

    return app;
  }
}
