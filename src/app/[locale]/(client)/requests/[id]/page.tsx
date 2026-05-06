import { getTranslations } from 'next-intl/server';
import { Calendar, FileText, Home } from 'lucide-react';
import { Box, Flex, Grid, HeaderInfo, Stack, Typography } from '@amdlre/design-system';
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
      <Box className="card-premium p-12 text-center">
        <Typography as="p" variant="small" className="text-sm font-bold text-brand-slate">
          {t('noRequests')}
        </Typography>
      </Box>
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
    <Stack gap={6} className="pb-24">
      <HeaderInfo
        size="md"
        title={t('details')}
        subtitle={`#${r.id}`}
        backHref={`/${locale}/requests`}
        actions={<RequestStatusBadge status={r.status} />}
      />

      <Grid gap={4} className="card-premium p-8 sm:grid-cols-2">
        <Detail icon={<Home size={16} />} label={t('selectProperty')} value={r.property_name} />
        <Detail
          icon={<Calendar size={16} />}
          label={t('scheduledAt')}
          value={formatDateTime(r.scheduled_at, locale)}
        />
        <Detail
          icon={<FileText size={16} />}
          label={t('type')}
          value={r.cleaning_type ? t(`types.${r.cleaning_type}` as 'types.regular') : undefined}
        />
        <Detail icon={<FileText size={16} />} label={t('notes')} value={r.notes} />
      </Grid>

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
          <Box className="card-premium p-8 text-center">
            <Typography as="p" variant="small" className="text-sm font-bold text-brand-slate">
              {tr('noReport')}
            </Typography>
          </Box>
        )
      )}
    </Stack>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <Stack gap={1}>
      <Flex align="center" gap={2} className="text-[10px] font-black uppercase tracking-widest text-brand-slate">
        <>{icon}</>
        <Box as="span">{label}</Box>
      </Flex>
      <Typography as="p" variant="small" className="text-sm font-bold text-brand-black">
        {value || '—'}
      </Typography>
    </Stack>
  );
}
