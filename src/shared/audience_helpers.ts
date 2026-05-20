import type { AudienceMeta } from '../types.js';

/** Fixed audience table fields; any other keys on row objects are treated as extra columns. */
const AUDIENCE_META_KEYS = [
  'uid',
  'name',
  'email',
  'photoURL',
  'signUpDate',
  'lastSignInTime',
] as const satisfies readonly (keyof AudienceMeta)[];

export const standardAudienceKeys = new Set<string>(AUDIENCE_META_KEYS);

export const extraAudienceColumns = (user: AudienceMeta) => {
  return Object.keys(user).filter((key) => !standardAudienceKeys.has(key));
};

export const keyToTitle = (key: string) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toUpperCase();
