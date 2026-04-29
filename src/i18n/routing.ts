import { defineRouting } from 'next-intl/routing';
import { APP_CONFIG } from '@/constants/config';

export const routing = defineRouting({
  locales: APP_CONFIG.i18n.locales,
  defaultLocale: APP_CONFIG.i18n.defaultLocale,
  localePrefix: 'always',
});
