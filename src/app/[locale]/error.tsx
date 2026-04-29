'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-2xl font-black text-brand-black">{t('error.title')}</h2>
      <p className="text-brand-slate">{t('error.description')}</p>
      <button onClick={reset} className="btn-primary">
        {t('error.retry')}
      </button>
    </div>
  );
}
