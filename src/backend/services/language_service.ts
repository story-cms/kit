import { inject } from '@adonisjs/core';
import {
  type LanguageSpecification,
  type LanguageTableItem,
  type LanguagesEditProps,
  type SettingsPageProps,
  type UserInterface,
} from '../../types.js';
import User from '../models/user.js';
import { CmsService } from './cms_service.js';
import { ProgressService } from './progress_service.js';

const defaultTranslationProgress = [
  { name: 'Interface', done: 0, draft: 0, total: 0 },
  { name: 'Content', done: 0, draft: 0, total: 0 },
];

@inject()
export class LanguageService {
  protected sourceLocale: string;

  constructor(protected cms: CmsService) {
    this.sourceLocale = cms.sourceLocale;
  }

  public find(locale: string): LanguageSpecification | undefined {
    return this.cms.config.languages.find(
      (lang: LanguageSpecification) => lang.locale === locale,
    );
  }

  public languagesEdit(): LanguagesEditProps {
    return {
      addedLanguages: this.cms.config.languages,
    };
  }

  public async settingsIndex(
    user: UserInterface,
  ): Promise<Pick<SettingsPageProps, 'sourceLanguage' | 'languageItems'>> {
    const sourceLanguageSpec =
      this.cms.config.languages.find(
        (lang: LanguageSpecification) => lang.locale === this.sourceLocale,
      ) ?? this.cms.config.languages[0];

    const progressService = new ProgressService(this.cms);
    const progressItems = await progressService.progress(user);
    const translationProgressByLocale = Object.fromEntries(
      (progressItems ?? []).map((item) => [item.locale, item.progress]),
    );

    const users = await User.query().where('name', '!=', 'redacted');

    const sourceLanguage = this.toLanguageTableItem(
      sourceLanguageSpec,
      translationProgressByLocale,
      users,
    );

    const languageItems = this.cms.config.languages
      .filter(
        (language: LanguageSpecification) => language.locale !== sourceLanguage.locale,
      )
      .map((language: LanguageSpecification) =>
        this.toLanguageTableItem(language, translationProgressByLocale, users),
      );

    return { sourceLanguage, languageItems };
  }

  public async addLanguages(languages: LanguageSpecification[]): Promise<void> {
    const existingLocales = new Set(
      this.cms.config.languages.map((lang: LanguageSpecification) => lang.locale),
    );
    const toAdd = languages.filter((lang) => !existingLocales.has(lang.locale));

    if (toAdd.length > 0) {
      await this.save([...this.cms.config.languages, ...toAdd]);
    }
  }

  public async updateBibleTranslation(
    locale: string,
    bibleVersion: string,
    bibleLabel: string,
  ): Promise<void> {
    if (!this.find(locale)) {
      throw new Error('Language not found');
    }

    const languages = this.cms.config.languages.map((lang: LanguageSpecification) =>
      lang.locale === locale ? { ...lang, bibleVersion, bibleLabel } : lang,
    );

    await this.save(languages);
  }

  public async removeLanguage(locale: string): Promise<void> {
    if (locale === this.sourceLocale) {
      throw new Error('Cannot remove the source language');
    }

    if (!this.find(locale)) {
      throw new Error('Language not found');
    }

    const languages = this.cms.config.languages.filter(
      (lang: LanguageSpecification) => lang.locale !== locale,
    );
    await this.save(languages);
  }

  private toLanguageTableItem(
    spec: LanguageSpecification,
    translationProgressByLocale: Record<string, LanguageTableItem['translationProgress']>,
    users: InstanceType<typeof User>[],
  ): LanguageTableItem {
    return {
      language: spec.language,
      languageDirection: spec.languageDirection,
      locale: spec.locale,
      bibleLabel: spec.bibleLabel,
      bibleVersion: spec.bibleVersion,
      translationProgress:
        translationProgressByLocale[spec.locale] ?? defaultTranslationProgress,
      teamMembers: users
        .filter((user) => user.language === spec.locale)
        .map((user) => user.meta),
    };
  }

  private async save(languages: LanguageSpecification[]) {
    await this.cms.patchConfig({ languages });
  }
}
