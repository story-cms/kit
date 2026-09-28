import { inject } from '@adonisjs/core';
import { type SupportCode } from '../../types.js';
import { CmsService } from './cms_service.js';
import { LanguageService } from './language_service.js';

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
  BUY_TOKENS: {
    code: 'BUY_TOKENS',
    subject: 'Token pool top-up requested',
    description: 'More AI translation tokens requested for the pool',
  },
} as const satisfies Record<string, SupportCodeDefinition>;

@inject()
export class SupportRequestService {
  constructor(protected cms: CmsService) {}

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
      const languageSpec = new LanguageService(this.cms).find(removeLanguageCode);
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

  private parseLanguageForSupport(spec: {
    language: string;
    locale: string;
  }): SupportRequestLanguageSpec {
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
}
