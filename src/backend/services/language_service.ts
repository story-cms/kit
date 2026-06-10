import { inject } from '@adonisjs/core';
import {
  type LanguageSpecification,
  type LanguageTableItem,
  type LanguagesEditProps,
  type SettingsPageProps,
  type SupportCode,
  type UserInterface,
} from '../../types.js';
import User from '../models/user.js';
import { CmsService } from './cms_service.js';
import { ProgressService } from './progress_service.js';

export interface SupportRequestLanguageSpec {
  name: string;
  nativeName: string;
  locale: string;
}

export interface SupportRequestDetails {
  subject: string;
  details: string;
  language?: SupportRequestLanguageSpec;
}

interface SupportCodeDefinition {
  code: SupportCode;
  description: string;
  subject: string;
}

const SUPPORT_CODES = {
  REMOVE_LANGUAGE: {
    code: 'REMOVE_LANGUAGE',
    subject: 'Remove language',
    description: 'Language requested to be removed',
  },
  UPDATE_LANGUAGE: {
    code: 'UPDATE_LANGUAGE',
    subject: 'App update - new language added.',
    description: 'Language requested to be added',
  },
  UPDATE_CONTENT: {
    code: 'UPDATE_CONTENT',
    subject: 'App update - content added.',
    description: 'Content requested to be updated',
  },
  UPDATE_APP: {
    code: 'UPDATE_APP',
    subject: 'App update - new language and content.',
    description: 'App update requested for new language and new content',
  },
} as const satisfies Record<string, SupportCodeDefinition>;

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

  public getSupportRequestDetails(
    supportCode: SupportCode,
    removeLanguageCode?: string,
  ): SupportRequestDetails {
    const definition = this.supportCodeDefinition(supportCode);
    if (!definition) {
      throw new Error('Invalid support code');
    }

    let language: SupportRequestLanguageSpec | undefined;
    if (supportCode === 'REMOVE_LANGUAGE' && removeLanguageCode) {
      const languageSpec = this.find(removeLanguageCode);
      if (languageSpec) {
        language = this.parseLanguageForSupport(languageSpec);
      }
    }

    return {
      subject: `Support request: ${definition.subject}`,
      details: definition.description,
      language,
    };
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

  private parseLanguageForSupport(
    spec: LanguageSpecification,
  ): SupportRequestLanguageSpec {
    const { language, locale } = spec;
    const name = language.split('|')[0].trim();

    if (language.includes('|')) {
      return { name, nativeName: language.split('|')[1].trim(), locale };
    }

    return { name, nativeName: language, locale };
  }

  private supportCodeDefinition(code: string): SupportCodeDefinition | undefined {
    return Object.values(SUPPORT_CODES).find((definition) => definition.code === code);
  }

  private async save(languages: LanguageSpecification[]) {
    await this.cms.patchConfig({ languages });
  }
}
