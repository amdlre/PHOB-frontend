import { getTranslations } from 'next-intl/server';
import { Calendar, FileText, Home } from 'lucide-react';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { formatDateTime } from '@/lib/utils';
import { RequestStatusBadge } from '@/components/shared/request-status-badge';
import { GuestConfirmButton } from '@/components/shared/guest-confirm-button';
import { VisitReportView } from '@/components/shared/visit-report-view';
import type { CleaningRequest, VisitReport } from '@/types/domain';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ClientRequestDetailPage({ params }: Props) {
  const { id, locale } = await params;
  const t = await getTranslations('request');
  const tr = await getTranslations('report');

  let request: CleaningRequest | null = null;
  let report: VisitReport | null = null;

  try {
    const res = await api.get<CleaningRequest>(ENDPOINTS.requests.detail(id));
    request = res.data;
  } catch {
    return (
      <div className="card-premium p-12 text-center">
        <p className="text-sm font-bold text-brand-slate">{t('noRequests')}</p>
      </div>
    );
  }

  try {
    const res = await api.get<VisitReport>(ENDPOINTS.reports.get(id));
    report = res.data;
  } catch {
    report = null;
  }

  const r = request!;
  const showCountdown = ['scheduled', 'awaiting_guest_confirmation'].includes(r.status);

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-brand-black">{t('details')}</h1>
          <p className="text-xs font-bold text-brand-slate">#{r.id}</p>
        </div>
        <RequestStatusBadge status={r.status} />
      </div>

      <div className="card-premium grid gap-4 p-8 sm:grid-cols-2">
        <Detail icon={<Home size={16} />} label={t('selectProperty')} value={r.property_name} />
        <Detail
          icon={<Calendar size={16} />}
          label={t('scheduledAt')}
          value={formatDateTime(r.scheduled_at, locale)}
        />
        <Detail icon={<FileText size={16} />} label={t('type')} value={r.cleaning_type ? t(`types.${r.cleaning_type}` as 'types.regular') : undefined} />
        <Detail icon={<FileText size={16} />} label={t('notes')} value={r.notes} />
      </div>

      {showCountdown && (
        <GuestConfirmButton
          requestId={r.id}
          scheduledAt={r.scheduled_at}
          alreadyConfirmed={!!r.guest_confirmed_at}
        />
      )}

      {report ? (
        <VisitReportView report={report} />
      ) : (
        r.status === 'completed' && (
          <div className="card-premium p-8 text-center">
            <p className="text-sm font-bold text-brand-slate">{tr('noReport')}</p>
          </div>
        )
      )}
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-sm font-bold text-brand-black">{value || '—'}</p>
    </div>
  );
}
