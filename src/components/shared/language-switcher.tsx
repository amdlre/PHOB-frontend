'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggle = () => {
    const next = locale === 'ar' ? 'en' : 'ar';
    const newPath = pathname.replace(`/${locale}`, `/${next}`);
    router.push(newPath);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-xl border border-brand-border bg-white px-3 py-2 text-xs font-black text-brand-black hover:border-brand-accent hover:text-brand-accent transition-all"
    >
      {locale === 'ar' ? 'EN' : 'عربي'}
    </button>
  );
}
