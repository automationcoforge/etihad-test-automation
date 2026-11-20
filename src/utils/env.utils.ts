const DEFAULT_BASE_URL = 'https://test.etihad.com/en-ae/';

export function getBaseURL(): string {
  const configuredURL = process.env.BASE_URL ?? DEFAULT_BASE_URL;

  let parsedURL: URL;
  try {
    parsedURL = new URL(configuredURL);
  } catch {
    throw new Error(`BASE_URL must be an absolute URL. Received: "${configuredURL}"`);
  }

  if (parsedURL.protocol !== 'http:' && parsedURL.protocol !== 'https:') {
    throw new Error('BASE_URL must use the http or https protocol.');
  }

  if (parsedURL.username || parsedURL.password) {
    throw new Error('BASE_URL must not contain embedded credentials.');
  }

  if (!parsedURL.pathname.endsWith('/')) {
    parsedURL.pathname += '/';
  }

  return parsedURL.toString();
}
