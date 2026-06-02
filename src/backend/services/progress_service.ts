import {
  FlagState,
  LanguageSpecification,
  type UserInterface,
  type Progress,
  type TranslationProgress,
} from '../../types.js';
import Index from '../models/index.js';
import Ui from '../models/ui.js';
import { inject } from '@adonisjs/core';
import { CmsService } from './cms_service.js';

@inject()
export class ProgressService {
  constructor(protected cms: CmsService) {}

  public async progress(user: UserInterface): Promise<TranslationProgress[]> {
    const translationProgress: TranslationProgress[] = [];
    const sourceLocale = this.cms.sourceLocale;

    const languages = this.cms.config.languages
      .filter((lang: LanguageSpecification) => lang.locale !== sourceLocale)
      .sort((a: LanguageSpecification, b: LanguageSpecification) =>
        a.language.localeCompare(b.language),
      );

    const index = await Index.all();
    const source = index.filter((item) => item.locale === sourceLocale);

    const totalPublishedCount = source.reduce((acc, item) => {
      acc += item.publishedList.length;
      return acc;
    }, 0);

    const indexByLocale = index.reduce(
      (acc, item) => {
        const uniqueDrafts = item.draftsList.filter(
          (draftId) => !item.publishedList.includes(draftId),
        );
        const updatedAt = item.updatedAt.toString();
        const existing = acc[item.locale];

        acc[item.locale] = {
          name: 'Content',
          done: (existing?.done ?? 0) + item.publishedList.length,
          draft: (existing?.draft ?? 0) + uniqueDrafts.length,
          total: totalPublishedCount,
          lastUpdated:
            !existing?.lastUpdated || updatedAt > existing.lastUpdated
              ? updatedAt
              : existing.lastUpdated,
        };

        return acc;
      },
      {} as Record<string, Progress>,
    );

    const rows = await Ui.all();
    const totalUiCount = rows.filter((row) => row.locale === sourceLocale).length;

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
