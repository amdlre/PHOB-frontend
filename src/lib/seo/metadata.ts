import type { Metadata } from 'next';
import { APP_CONFIG } from '@/constants/config';

interface MetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  pathname?: string;
}

const defaultMeta = {
  ar: {
    title: 'منصة بوف — نظافة احترافية لشقق التأجير اليومي',
    description:
      'نظافة فندقية احترافية لشقق Airbnb والتأجير اليومي. اشتراكات شهرية بزيارات لا محدودة، تجهيز كامل لاستقبال الضيوف.',
  },
  en: {
    title: 'PHOB — Hotel-Grade Cleaning for Short-Term Rentals',
    description:
      'Professional hotel-grade cleaning for Airbnb and short-term rental units. Monthly subscriptions with unlimited visits and full guest-ready preparation.',
  },
};

export function generateSiteMetadata(locale: string, options?: MetadataOptions): Metadata {
  const lang = locale as 'ar' | 'en';
  const siteUrl = APP_CONFIG.url;

  const title = options?.title
    ? `${options.title} | ${defaultMeta[lang].title}`
    : defaultMeta[lang].title;
  const description = options?.description || defaultMeta[lang].description;
  const image = options?.image || `${siteUrl}/og-image.png`;
  const url = options?.pathname
    ? `${siteUrl}/${locale}${options.pathname}`
    : `${siteUrl}/${locale}`;

  return {
    title,
    description,
    keywords: options?.keywords,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
      languages: {
        ar: `${siteUrl}/ar${options?.pathname || ''}`,
        en: `${siteUrl}/en${options?.pathname || ''}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'PHOB',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: options?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
