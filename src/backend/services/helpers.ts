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
