import {
  FlagState,
  LanguageSpecification,
  type UserInterface,
  type Progress,
  type TranslationProgress,
} from '../../types.js';
import Index from '../models/index.js';
import Ui from '../models/ui.js';
import cms from './cms.js';

export class ProgressService {
  public async progress(user: UserInterface): Promise<TranslationProgress[]> {
    const translationProgress: TranslationProgress[] = [];

    const languages = cms.config.languages.languages
      .filter((lang: LanguageSpecification) => lang.locale !== 'en')
      .sort((a: LanguageSpecification, b: LanguageSpecification) =>
        a.language.localeCompare(b.language),
      );

    const index = await Index.all();

    const source = index.filter((item) => item.locale === 'en');
    const translations = index.filter((item) => item.locale !== 'en');

    const totalPublishedCount = source.reduce((acc, item) => {
      acc += item.publishedList.length;
      return acc;
    }, 0);

    const draftCount = translations.reduce((acc, item) => {
      const uniqueDrafts = item.draftsList.filter(
        (draftId) => !item.publishedList.includes(draftId),
      );
      acc += uniqueDrafts.length;
      return acc;
    }, 0);

    const indexByLocale = index.reduce(
      (acc, item) => {
        acc[item.locale] = {
          name: 'Content',
          done: item.publishedList.length,
          draft: draftCount,
          total: totalPublishedCount,
          lastUpdated: item.updatedAt.toString(),
        };
        return acc;
      },
      {} as Record<string, Progress>,
    );

    const rows = await Ui.all();
    const totalUiCount = rows.filter((row) => row.locale === 'en').length;

    for (const language of languages) {
      const contentProgress = indexByLocale[language.locale] ?? {
        name: 'Content',
        done: 0,
        draft: 0,
        total: totalPublishedCount,
        lastUpdated: '',
      };

      const scoped = rows.filter((row) => row.locale === language.locale);

      const done = scoped.filter((row) => row.microCopy && !row.flag).length;
      const draft = scoped.filter((row) => row.flag === FlagState.PREFILLED).length;

      translationProgress.push({
        locale: language.locale,
        language: language.language,
        isReadOnly: !user.isAllowed(language.locale),
        progress: [
          {
            name: 'Interface',
            done,
            draft,
            total: totalUiCount,
            lastUpdated:
              rows
                .map((row) => row.updatedAt)
                .sort()
                .pop()
                ?.toString() ?? '',
          },
          contentProgress,
        ],
      });
    }

    return translationProgress;
  }
}
