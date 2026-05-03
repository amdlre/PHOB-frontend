export type Locale = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}
