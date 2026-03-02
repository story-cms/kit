import type { App, PropType } from 'vue';
import type { FieldSpec } from '../../types';
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

export const getCampaignStatus = (
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
 * Ensures the stored value is T00:00:00.000Z on the selected date so that:
 * - When user selects today: element is visible instantly (valid at T00:00:00.000Z)
 * - When user selects any other day: element is shown from T00:00:00.000Z on that date
 *
 * @param date - The date selected by the user
 * @param hasTimePicker - Whether the field has time picker enabled
 * @param endOfDay - When true (date-only only), store as T23:59:59.999Z for range end dates
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
