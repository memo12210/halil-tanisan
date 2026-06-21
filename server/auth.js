import bcrypt from 'bcryptjs';

export const COOKIE_NAME = 'cms_session';
const SESSION_VALUE = 'authenticated';
const MAX_AGE_MS = 1000 * 60 * 60 * 8; // 8 hours

export async function verifyCredentials(username, password, { adminUser, passwordHash }) {
  if (!adminUser || !passwordHash) return false;
  // Always run a bcrypt compare to keep timing uniform regardless of username match.
  const passwordOk = await bcrypt.compare(String(password ?? ''), passwordHash);
  return username === adminUser && passwordOk;
}

export function isAuthenticated(req) {
  return req?.signedCookies?.[COOKIE_NAME] === SESSION_VALUE;
}

export function setSessionCookie(res, { secure }) {
  res.cookie(COOKIE_NAME, SESSION_VALUE, {
    signed: true,
    httpOnly: true,
    sameSite: 'strict',
    secure,
    maxAge: MAX_AGE_MS,
    path: '/',
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    signed: true,
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
  });
}
