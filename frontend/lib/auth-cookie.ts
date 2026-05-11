const ACCESS = 'accessToken';

/** Client-only: keep middleware + axios in sync (non-httpOnly cookie). */
export function setAccessTokenCookie(token: string) {
  if (typeof document === 'undefined') return;
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `${ACCESS}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function clearAccessTokenCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${ACCESS}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function readAccessTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(
    new RegExp(`(?:^|; )${ACCESS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`)
  );
  return m ? decodeURIComponent(m[1]) : null;
}
