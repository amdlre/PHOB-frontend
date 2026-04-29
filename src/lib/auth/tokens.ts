import { cookies } from 'next/headers';
import { APP_CONFIG } from '@/constants/config';

export async function setAuthTokens(accessToken: string, refreshToken?: string) {
  const cookieStore = await cookies();
  cookieStore.set(APP_CONFIG.auth.cookieName, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: APP_CONFIG.auth.cookieMaxAge,
    path: '/',
  });
  if (refreshToken) {
    cookieStore.set(APP_CONFIG.auth.refreshCookieName, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: APP_CONFIG.auth.cookieMaxAge * 7,
      path: '/',
    });
  }
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(APP_CONFIG.auth.cookieName)?.value || null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(APP_CONFIG.auth.refreshCookieName)?.value || null;
}

export async function clearAuthTokens() {
  const cookieStore = await cookies();
  cookieStore.delete(APP_CONFIG.auth.cookieName);
  cookieStore.delete(APP_CONFIG.auth.refreshCookieName);
}
