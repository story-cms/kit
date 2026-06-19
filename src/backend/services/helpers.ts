export {
  extraAudienceColumns,
  keyToTitle,
  standardAudienceKeys,
} from '../../shared/audience_helpers.js';

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
