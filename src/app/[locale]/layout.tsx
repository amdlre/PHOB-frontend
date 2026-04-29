import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Cairo, Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { Providers } from '@/providers';
import { generateSiteMetadata } from '@/lib/seo/metadata';
import { getCurrentUser } from '@/lib/auth/session';
import '../globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateSiteMetadata(locale);
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'ar' | 'en')) notFound();

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const initialUser = await getCurrentUser();

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${cairo.variable} ${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers initialUser={initialUser}>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
