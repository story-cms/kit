export {
  extraAudienceColumns,
  keyToTitle,
  standardAudienceKeys,
} from '../../shared/audience_helpers.js';

export {
  canPublishStory,
  canPublishStoryMetadata,
  canPublishStoryReady,
  DEVOTION_TEMPLATE_ID,
  COURSE_TEMPLATE_ID,
  isDevotionTemplate,
  isCourseTemplate,
  missingPublishedChapters,
  storyDetailsBlockedMessages,
  publishBlockedMessage,
  storyMetadataBlockedMessages,
  storyPublishBlockedMessage,
  storyTypeBlockedMessages,
  type StoryPublishMetadata,
} from '../../shared/story_helpers.js';

export const INT32_MAX = 2147483647;

const buildIdPattern = (max: number): RegExp => {
  const digits = String(max);
  // canonical numbers (no leading zeros) that are shorter than max
  const alternatives = [`[1-9]\\d{0,${digits.length - 2}}`];
  // numbers with max's length that are below it, one deviating position at a time
  for (let i = 0; i < digits.length; i++) {
    const limit = Number(digits[i]);
    const lowest = i === 0 ? 1 : 0;
    if (limit <= lowest) continue;
    const range = limit - 1 === lowest ? `${lowest}` : `[${lowest}-${limit - 1}]`;
    const rest = digits.length - i - 1;
    alternatives.push(`${digits.slice(0, i)}${range}${rest > 0 ? `\\d{${rest}}` : ''}`);
  }
  alternatives.push(digits);
  return new RegExp(`^(?:${alternatives.join('|')})$`);
};

/** Canonical positive int32: no sign, no leading zeros, 1..2147483647. */
export const ID_PATTERN = buildIdPattern(INT32_MAX);

/**
 * Route matcher for numeric ids, used in place of `router.matchers.number()`.
 * See https://docs.adonisjs.com/guides/basics/routing#route-param-validation
 * Out-of-range values fail `match`, so they 404 instead of hitting the DB.
 */
export const idMatcher = {
  match: ID_PATTERN,
  cast: (value: string): number => Number(value),
};

/** Accepts the raw string or an id already cast by the router matcher. */
export const parseId = (raw: unknown): number | undefined => {
  if (typeof raw !== 'string' && typeof raw !== 'number') return undefined;
  const text = String(raw);
  return ID_PATTERN.test(text) ? Number(text) : undefined;
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

export const slugify = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};
