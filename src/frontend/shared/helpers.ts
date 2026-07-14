import type { App, Component, PropType } from 'vue';
import { type FieldSpec, type LanguageSpecification } from '../../types';
import { BibleBooksMap } from './bibleBooks';
import type { Variant, Story } from 'histoire';
import { DateTime } from 'luxon';

export const commonProps = {
  field: {
    type: Object as PropType<FieldSpec>,
    required: true,
  },

  rootPath: {
    type: String,
    required: false,
  },

  isNested: {
    type: Boolean,
    default: false,
  },

  isReadOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
};

export const expandShortcuts = (text: string) => {
  // tilde -> non-breaking space character
  return text.replace(/~/g, '\u00A0');
};

export const padZero = (value: number): string => (value > 9 ? `${value}` : `0${value}`);

const LANGUAGE_LABEL_SEPARATOR = /\s*-\s*|\s*\|\s*/;

export type LanguageSortable = Pick<LanguageSpecification, 'language' | 'locale'>;

/**
 * Match stored language to API language.
 * Handles stored formats: "Bengali - বাংলা", "Arabic - عربى", "English | American".
 * API returns: "Bengali", "Arabic, Sudanese Creole", "English".
 */
export const languageMatches = (stored: string, api: string): boolean => {
  const storedBase = stored.split(LANGUAGE_LABEL_SEPARATOR)[0].trim();
  return (
    api === storedBase ||
    api.startsWith(storedBase + ',') ||
    api.startsWith(storedBase + ' ')
  );
};

export const formatDate = (value: string): string => {
  const d = new Date(value);
  return `${padZero(d.getDate())}/${padZero(d.getMonth() + 1)}/${padZero(
    d.getFullYear(),
  )}, ${padZero(d.getHours())}:${padZero(d.getMinutes())}`;
};

export const debounce = <T extends (...args: any[]) => void>(
  wait: number,
  callback: T,
  immediate = false,
) => {
  let timeout: ReturnType<typeof setTimeout> | null;

  return function <U>(this: U, ...args: Parameters<typeof callback>) {
    const context = this; // eslint-disable-line
    const later = () => {
      timeout = null;

      if (!immediate) {
        callback.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;

    if (typeof timeout === 'number') {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) {
      callback.apply(context, args);
    }
  };
};

export const safeChapterTitle = (
  title: string | null,
  storyName: string,
  number: number,
): string | null => {
  if (!title) return null;

  const safe = title.replace(/</g, '&lt;');

  return `${storyName} <span>.</span> ${padZero(number)} <span>.</span> ${safe}`;
};

export const parseReference = (reference: string): string => {
  const standardReference = fromStandardReference(reference);
  if (standardReference !== '') {
    return reference;
  }

  const match = reference
    .trim()
    .toLocaleLowerCase()
    .match(/(\d+)?\s*(\w+)\s*(\d+)(?:\s*[:.]\s*(\d+))?(?:\s*-\s*(?:(\d+):)?(\d+))?/);

  if (!match) {
    return '';
  }

  const bookNum = match[1];
  let book = match[2];
  const chapter = match[3];
  const verse = match[4];
  const endChapter = match[5];
  const endVerse = match[6];

  if (bookNum) {
    book = `${bookNum} ${book}`;
  }
  const abbreviation = getAbbreviation(book);

  if (!abbreviation) {
    return '';
  }

  let referenceString = `${abbreviation}.${chapter}`;

  if (verse) {
    referenceString += `.${verse}`;
    if (endVerse) {
      const targetChapter = endChapter || chapter;
      referenceString += `-${abbreviation}.${targetChapter}.${endVerse}`;
    }
  }

  return referenceString;
};

// if the passed reference is not in the standard format, return an empty string,
// otherwise, return a parseable reference
function fromStandardReference(reference: string): string {
  // starts with three letters followed by a dot and a number
  if (!/^[A-Z]{3}\.\d+\.\d+$/.test(reference)) {
    return '';
  }

  const [book, chapter, verse] = reference.split('.');
  const bookName = bookNameFromAbbreviation(book);
  if (!bookName) {
    return '';
  }
  return `${bookName} ${chapter}:${verse}`;
}

function bookNameFromAbbreviation(abbreviation: string): string {
  for (const book in BibleBooksMap) {
    if (BibleBooksMap[book][0].toUpperCase() === abbreviation) {
      return book;
    }
  }

  return '';
}

function getAbbreviation(inputBook: string): string {
  for (const book in BibleBooksMap) {
    if (book === inputBook || BibleBooksMap[book].includes(inputBook)) {
      return BibleBooksMap[book][0].toUpperCase();
    }
  }

  return '';
}

export type StoryHandler = (payload: {
  app: App<any>;
  story: Story;
  variant: Variant;
}) => void | Promise<void>;

export const getInvitationStatus = (
  isPublished: boolean,
  windowValue: string,
  now?: DateTime,
): 'Draft' | 'Scheduled' | 'Completed' | 'Live' => {
  const parts = windowValue.split('|');
  const windowStart = DateTime.fromISO(parts[0]?.trim() || '');
  const windowEnd = DateTime.fromISO(parts[1]?.trim() || '');
  const currentTime = now ?? DateTime.now();

  if (!isPublished) return 'Draft';
  if (!windowStart.isValid || !windowEnd.isValid) return 'Draft';
  if (currentTime < windowStart) return 'Scheduled';
  if (currentTime > windowEnd) return 'Completed';
  return 'Live';
};

/**
 * Normalizes a date for storage when the date field is used without a time picker.
 *
 * When endOfDay is false: stores as T00:00:00.000Z on the selected date.
 * - User selects today → visible instantly from midnight UTC
 * - User selects any other day → shown from T00:00:00.000Z on that date
 *
 * When endOfDay is true (date-range end dates): stores as T23:59:59.999Z so the
 * range includes the full last day; invitation stays Live through end of that day.
 *
 * @param date - The date selected by the user
 * @param hasTimePicker - Whether the field has time picker enabled
 * @param endOfDay - When true, store as T23:59:59.999Z for date-range end dates
 * @returns The date to store (Date object that serializes to ISO string)
 */
export function normalizeDateForStorage(
  date: Date,
  hasTimePicker: boolean,
  endOfDay = false,
): Date {
  if (hasTimePicker) {
    return date;
  }
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  if (endOfDay) {
    return new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
  }
  return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
}

/**
 * Parses an ISO date string (e.g. from date-range storage) to a local Date for picker display.
 * Extracts the calendar date (Y-M-D) and creates noon local - avoids timezone shift
 * where T00:00:00.000Z or T23:59:59.999Z would display as the wrong day.
 */
export function parseIsoDateForDisplay(iso: string): Date | null {
  const match = iso.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);
  const d = new Date(year, month, day, 12, 0, 0, 0);
  return isNaN(d.getTime()) ? null : d;
}

const HELPSCOUT_BEACON_ID = '14f5b859-dd91-4433-917d-d1a94e412eea';

export const helpScoutWidget = (page: { props: Record<string, unknown> }) => {
  if (!page.props.user || (window as any).__helpscoutBeaconInitialized) return;

  (window as any).__helpscoutBeaconInitialized = true;

  const loadBeacon = () => {
    const s = document.getElementsByTagName('script')[0];
    const n = document.createElement('script');
    n.type = 'text/javascript';
    n.async = true;
    n.src = 'https://beacon-v2.helpscout.net';
    s.parentNode?.insertBefore(n, s);
  };

  if (!(window as any).Beacon) {
    (window as any).Beacon = function (
      method: string,
      options?: unknown,
      data?: unknown,
    ) {
      ((window as any).Beacon.readyQueue = (window as any).Beacon.readyQueue || []).push({
        method,
        options,
        data,
      });
    };
    (window as any).Beacon.readyQueue = [];
  }

  if (document.readyState === 'complete') {
    loadBeacon();
  } else {
    window.addEventListener('load', loadBeacon, false);
  }

  (window as any).Beacon('init', HELPSCOUT_BEACON_ID);
};

/** Display name from a language label (text before `|` or `-` when present). */
export function languageDisplayName(language: string): string {
  const parts = language.split(LANGUAGE_LABEL_SEPARATOR);
  if (parts.length >= 2) {
    return parts[0].trim();
  }
  return language;
}

/** A–Z by display name (e.g. add-language list); English is not pinned first. */
export function compareLanguagesByDisplayName(
  a: LanguageSortable,
  b: LanguageSortable,
): number {
  return languageDisplayName(a.language).localeCompare(languageDisplayName(b.language));
}

export function sortLanguagesByDisplayName<T extends LanguageSortable>(
  languages: T[],
): T[] {
  return [...languages].sort(compareLanguagesByDisplayName);
}

/** Name, native name, and locale from a language specification. */
export function parseLanguageSpecification(spec: LanguageSpecification): {
  name: string;
  nativeName: string;
  locale: string;
} {
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

/** Return the logical parent path for sidebar back navigation, or null to fall back to browser history. */
export function parentPathForBack(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const locale = segments[0];
  const section = segments[1];

  if (section === 'dashboard' && segments.length === 2) return null;

  if (section === 'story') {
    if (segments.length === 2) return `/${locale}/dashboard`;
    if (segments[2] === 'create') return `/${locale}/story`;
    if (segments.length === 3) return `/${locale}/story`;
    if (segments.length === 4 && segments[3] === 'edit') {
      return `/${locale}/story/${segments[2]}`;
    }
    if (segments[3] === 'draft' || segments[3] === 'chapter') {
      return `/${locale}/story/${segments[2]}`;
    }
  }

  if (section === 'page') {
    if (segments.length === 2) return `/${locale}/dashboard`;
    if (segments[2] === 'create') return `/${locale}/page`;
    if (segments.length === 4 && segments[3] === 'edit') return `/${locale}/page`;
  }

  if (section === 'resource') {
    if (segments.length === 2) return `/${locale}/dashboard`;
    if (segments[2] === 'create') return `/${locale}/resource`;
    if (segments.length === 4 && segments[3] === 'edit') return `/${locale}/resource`;
  }

  if (section === 'stream') {
    if (segments.length === 2) return `/${locale}/dashboard`;
    if (segments.length === 3) return `/${locale}/stream`;
    if (segments[3] === 'drop' && segments[4] === 'create') {
      return `/${locale}/stream/${segments[2]}`;
    }
  }

  if (section === 'invitation') {
    if (segments.length === 2) return `/${locale}/dashboard`;
    if (segments[2] === 'create') return `/${locale}/invitation`;
    if (segments[3] === 'edit' || segments[3] === 'stats') {
      return `/${locale}/invitation`;
    }
  }

  if (section === 'settings') {
    if (segments.length === 2) return `/${locale}/dashboard`;
    if (segments[2] === 'languages' && segments[3] === 'edit') {
      return `/${locale}/settings`;
    }
  }

  if (section === 'audience') {
    if (segments.length === 2) return `/${locale}/dashboard`;
    if (segments[2] === 'users' || segments[2] === 'export') {
      return `/${locale}/audience`;
    }
  }

  if (section === 'user' && segments.length === 2) return `/${locale}/dashboard`;
  if (section === 'ui' && segments.length === 2) return `/${locale}/dashboard`;

  return null;
}

/** Redirect unsafe paths to a locale-switchable parent before swapping locale. */
export function normalizePathForLanguageSwitch(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (
    segments.length >= 5 &&
    segments[1] === 'story' &&
    segments[3] === 'chapter'
  ) {
    return `/${segments.slice(0, 3).join('/')}`;
  }
  if (segments.length === 3 && segments[1] === 'story' && segments[2] === 'create') {
    return `/${segments.slice(0, 2).join('/')}`;
  }
  return pathname;
}

/** Swap the locale segment in a pathname, or return null if not localized. */
export function replaceLocaleInPath(
  pathname: string,
  targetLocale: string,
  knownLocales: string[],
): string | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0 || !knownLocales.includes(segments[0])) {
    return null;
  }
  segments[0] = targetLocale;
  return `/${segments.join('/')}`;
}

export function isLucideIcon(icon: string | Component): icon is Component {
  return typeof icon === 'object' || typeof icon === 'function';
}

