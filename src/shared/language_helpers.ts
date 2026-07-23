import type { LanguageSpecification, LocaleItem } from '../types.js';

export const LANGUAGE_LABEL_SEPARATOR = /\s*-\s*|\s*\|\s*/;

/** Name, native name, and locale from a language specification. */
export function parseLanguageSpecification(spec: LanguageSpecification): LocaleItem {
  const { language, locale } = spec;
  const parts = language.split(LANGUAGE_LABEL_SEPARATOR).map((part) => part.trim());

  if (parts.length >= 2) {
    return {
      name: parts[0],
      nativeName: parts.slice(1).join(' - '),
      locale,
    };
  }

  return { name: language, nativeName: language, locale };
}
