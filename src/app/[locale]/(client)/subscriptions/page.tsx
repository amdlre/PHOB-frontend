import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { formatDate } from '@/lib/utils';
import type { Subscription } from '@/types/domain';
import type { PageProps } from '@/types';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  expired: 'bg-slate-100 text-slate-700 border-slate-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default async function ClientSubscriptionsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('subscription');

  let subs: Subscription[] = [];
  try {
    const res = await api.get<Subscription[]>(ENDPOINTS.subscriptions.list);
    subs = res.data;
  } catch {
    subs = [];
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight text-brand-black">{t('title')}</h1>
        <Link href={`/${locale}/subscriptions/new`} className="btn-primary">
          <Plus size={16} />
          <span>{t('newSubscription')}</span>
        </Link>
      </div>

      {subs.length === 0 ? (
        <div className="card-premium flex flex-col items-center gap-4 p-16 text-center">
          <Sparkles size={40} className="text-brand-slate" strokeWidth={1.5} />
          <p className="text-sm font-bold text-brand-slate">{t('noSubscriptions')}</p>
        </div>
      ) : (
        <div className="card-premium overflow-hidden">
          <table className="w-full">
            <thead className="bg-brand-offwhite text-right">
              <tr>
                <Th>{t('selectProperty')}</Th>
                <Th>{t('package')}</Th>
                <Th>{t('startDate')}</Th>
                <Th>{t('endDate')}</Th>
                <Th>{t('status')}</Th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="border-t border-brand-border text-right text-sm">
                  <Td>{s.property_name || s.property_id}</Td>
                  <Td>{s.package_name || s.package_id}</Td>
                  <Td>{formatDate(s.start_date, locale)}</Td>
                  <Td>{formatDate(s.end_date, locale)}</Td>
                  <Td>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${STATUS_STYLES[s.status] ?? STATUS_STYLES.pending}`}
                    >
                      {t(`statuses.${s.status}` as `statuses.active`)}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-brand-slate">
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4 font-bold text-brand-black">{children}</td>;
}
