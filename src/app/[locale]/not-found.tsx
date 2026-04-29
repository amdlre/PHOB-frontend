import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('common');
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-7xl font-black text-brand-black">404</h1>
      <p className="text-brand-slate">{t('notFound.description')}</p>
      <Link href="/" className="btn-primary">
        {t('notFound.backHome')}
      </Link>
    </div>
  );
}
