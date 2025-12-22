import { DateTime } from 'luxon';
import type { CampaignItem } from '../../types';

export function trimmedErrors(e: any): Record<string, string[]> {
  let trimmed = e.messages.reduce((acc: Record<string, string[]>, error: any) => {
    const field = error.field;
    if (!acc[field]) {
      acc[field] = [];
    }
    acc[field].push(error.message);
    return acc;
  }, {});

  // only show the first 25 errors to avoid the cookie size limit
  if (Object.keys(trimmed).length < 26) return trimmed;

  trimmed = Object.keys(trimmed)
    .slice(0, 25)
    .reduce(
      (acc: Record<string, string[]>, key) => {
        acc[key] = trimmed[key];
        return acc;
      },
      {} as Record<string, string[]>,
    );

  return trimmed;
}

// The model store on the client requires that the error messages
// each have a "bundle" prefix
export const bundledErrors = (plain: Record<string, string[]>): object => {
  const result: Record<string, unknown> = {};
  for (const key in plain) {
    result[`bundle.${key}`] = plain[key];
  }
  return result;
};

export const getCredentialsFrom = (key: string): any => {
  const credentialsBase64 = process.env[key] || '';
  if (!credentialsBase64) {
    throw new Error(`${key} environment variable is not set.`);
  }

  try {
    const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString('utf-8');
    const parsed = JSON.parse(credentialsJson);
    return parsed;
  } catch {
    throw new Error(`${key} environment variable is not a valid encoded JSON string.`);
  }
};

export function categorizeAndSortCampaigns(
  items: CampaignItem[],
  now: DateTime = DateTime.now(),
): CampaignItem[] {
  function getWindowStart(item: CampaignItem): DateTime | null {
    if (!item.window) return null;
    const [startStr] = item.window.split('|');
    return DateTime.fromISO(startStr);
  }

  const categorized = items.reduce(
    (acc, item) => {
      if (!item.window) {
        acc.noWindow.push(item);
        return acc;
      }

      const [startStr, endStr] = item.window.split('|');
      const windowStart = DateTime.fromISO(startStr);
      const windowEnd = DateTime.fromISO(endStr);

      if (now >= windowStart && now <= windowEnd) {
        acc.current.push(item);
      } else if (windowStart > now) {
        acc.upcoming.push(item);
      } else {
        acc.past.push(item);
      }

      return acc;
    },
    {
      current: [] as CampaignItem[],
      upcoming: [] as CampaignItem[],
      past: [] as CampaignItem[],
      noWindow: [] as CampaignItem[],
    },
  );

  categorized.current.sort((a, b) => {
    const aStart = getWindowStart(a);
    const bStart = getWindowStart(b);
    if (!aStart || !bStart) return 0;
    return aStart.toMillis() - bStart.toMillis();
  });

  categorized.upcoming.sort((a, b) => {
    const aStart = getWindowStart(a);
    const bStart = getWindowStart(b);
    if (!aStart || !bStart) return 0;
    return aStart.toMillis() - bStart.toMillis();
  });

  categorized.past.sort((a, b) => {
    const aStart = getWindowStart(a);
    const bStart = getWindowStart(b);
    if (!aStart || !bStart) return 0;
    return bStart.toMillis() - aStart.toMillis();
  });

  return [
    ...categorized.current,
    ...categorized.upcoming,
    ...categorized.past,
    ...categorized.noWindow,
  ];
}
