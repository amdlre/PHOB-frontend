export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'PHOB',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  api: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://localhost:8000/api/v1',
  },
  i18n: {
    defaultLocale: (process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'ar') as 'ar' | 'en',
    locales: ['ar', 'en'] as const,
  },
  auth: {
    cookieName: process.env.AUTH_COOKIE_NAME || 'access_token',
    refreshCookieName: process.env.AUTH_REFRESH_COOKIE_NAME || 'refresh_token',
    cookieMaxAge: Number(process.env.AUTH_COOKIE_MAX_AGE) || 86400,
  },
  maps: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  },
} as const;
