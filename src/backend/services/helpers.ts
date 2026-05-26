export {
  extraAudienceColumns,
  keyToTitle,
  standardAudienceKeys,
} from '../../shared/audience_helpers.js';

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
