import type { MetadataRoute } from 'next';
import { APP_CONFIG } from '@/constants/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = APP_CONFIG.url;
  const locales = APP_CONFIG.i18n.locales;
  const staticRoutes = ['', '/login', '/register'];
  const entries: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'monthly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${route}`])),
        },
      });
    }
  }
  return entries;
}
