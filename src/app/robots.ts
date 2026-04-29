import type { MetadataRoute } from 'next';
import { APP_CONFIG } from '@/constants/config';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = APP_CONFIG.url;
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/employee/', '/properties/', '/subscriptions/', '/requests/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
