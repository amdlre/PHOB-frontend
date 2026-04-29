import Link from 'next/link';
import { Calendar, Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { formatDateTime } from '@/lib/utils';
import { RequestStatusBadge } from '@/components/shared/request-status-badge';
import type { CleaningRequest } from '@/types/domain';
import type { PageProps } from '@/types';

export default async function ClientRequestsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('request');

  let requests: CleaningRequest[] = [];
  try {
    const res = await api.get<CleaningRequest[]>(ENDPOINTS.requests.list);
    requests = res.data;
  } catch {
    requests = [];
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight text-brand-black">{t('myRequests')}</h1>
        <Link href={`/${locale}/requests/new`} className="btn-primary">
          <Plus size={16} />
          <span>{t('newRequest')}</span>
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="card-premium flex flex-col items-center gap-4 p-16 text-center">
          <Calendar size={40} className="text-brand-slate" strokeWidth={1.5} />
          <p className="text-sm font-bold text-brand-slate">{t('noRequests')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <Link
              key={r.id}
              href={`/${locale}/requests/${r.id}`}
              className="card-premium flex flex-wrap items-center justify-between gap-4 p-6 transition-transform hover:-translate-y-0.5"
            >
              <div className="space-y-1">
                <p className="text-sm font-black text-brand-black">{r.property_name || r.property_id}</p>
                <p className="text-xs font-bold text-brand-slate" dir="ltr">
                  {formatDateTime(r.scheduled_at, locale)}
                </p>
              </div>
              <RequestStatusBadge status={r.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
