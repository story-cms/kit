import type { LanguageSpecification, LocaleItem } from '../types.js';

export const LANGUAGE_LABEL_SEPARATOR = /\s*-\s*|\s*\|\s*/;

/** Whether tag is a well-formed IETF BCP 47 language tag (hyphen-separated). */
export function isValidLanguageTag(tag: string): boolean {
  try {
    new Intl.Locale(tag);
    return true;
  } catch {
    return false;
  }
}

/** Name, native name, and locale from a language specification. */
export function parseLanguageSpecification(spec: LanguageSpecification): LocaleItem {
  const { language, locale, languageDirection } = spec;
  const parts = language.split(LANGUAGE_LABEL_SEPARATOR).map((part) => part.trim());

  if (parts.length >= 2) {
    return {
      name: parts[0],
      nativeName: parts.slice(1).join(' - '),
      locale,
      languageDirection,
    };
  }

  return { name: language, nativeName: language, locale, languageDirection };
}
