// Remembers where an unauthenticated visit started (e.g. /btg-poc) so the
// OAuth callback can send the user back there instead of the default `/`.
const KEY = 'ics_return_to';

export function rememberReturnTo(path: string) {
  try {
    sessionStorage.setItem(KEY, path);
  } catch {
    // storage blocked: the user just lands on `/` after login
  }
}

export function consumeReturnTo(): string | null {
  try {
    const path = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    // Same-origin paths only — never an open redirect.
    return path && path.startsWith('/') && !path.startsWith('//') ? path : null;
  } catch {
    return null;
  }
}
