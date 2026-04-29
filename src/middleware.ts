import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';
import { APP_CONFIG } from '@/constants/config';

const intlMiddleware = createMiddleware(routing);

const PUBLIC_PATHS = ['/', '/login', '/register'];
const AUTH_PATHS = ['/login', '/register'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Find locale segment in path
  const localeSegment = APP_CONFIG.i18n.locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  const pathWithoutLocale = localeSegment
    ? pathname.replace(`/${localeSegment}`, '') || '/'
    : pathname;

  const token = request.cookies.get(APP_CONFIG.auth.cookieName)?.value;

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(`${p}/`) && p !== '/',
  ) || pathWithoutLocale === '/';

  const isAuthPage = AUTH_PATHS.some((p) => pathWithoutLocale === p);

  // Redirect authenticated users away from auth pages
  if (isAuthPage && token) {
    const locale = localeSegment || APP_CONFIG.i18n.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // Protect dashboard / employee routes
  if (!isPublic && !isAuthPage && !token) {
    const locale = localeSegment || APP_CONFIG.i18n.defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
