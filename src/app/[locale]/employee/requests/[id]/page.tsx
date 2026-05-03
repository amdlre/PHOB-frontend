import { Building2, Calendar, Hash, Layers, Mail, MapPin, Phone, User } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Box, Flex, Grid, Stack, Typography } from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { formatDateTime } from '@/lib/utils';
import { RequestStatusBadge } from '@/components/shared/request-status-badge';
import { VisitReportForm } from '@/components/forms/visit-report-form';
import { VisitReportView } from '@/components/shared/visit-report-view';
import { StatusUpdateControl } from '@/components/shared/status-update-control';
import type { CleaningRequest, Property, Subscription, VisitReport } from '@/types/domain';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EmployeeRequestDetailPage({ params }: Props) {
  const { id, locale } = await params;
  const t = await getTranslations('request');
  const tp = await getTranslations('property');
  const ts = await getTranslations('subscription');

  let request: CleaningRequest | null = null;
  let property: Property | null = null;
  let subscription: Subscription | null = null;
  let report: VisitReport | null = null;

  try {
    const res = await api.get<CleaningRequest>(ENDPOINTS.requests.detail(id));
    request = res.data;
  } catch {
    return <Box className="card-premium p-12 text-center">{t('noRequests')}</Box>;
  }

  if (request?.property_id) {
    try {
      const res = await api.get<Property>(ENDPOINTS.properties.detail(request.property_id));
      property = res.data;
    } catch {
      // ignore
    }
    try {
      const res = await api.get<Subscription>(
        ENDPOINTS.subscriptions.byProperty(request.property_id),
      );
      subscription = res.data;
    } catch {
      // ignore
    }
  }

  try {
    const res = await api.get<VisitReport>(ENDPOINTS.reports.get(id));
    report = res.data;
  } catch {
    report = null;
  }

  const r = request!;
  const mapsUrl =
    property?.lat && property?.lng
      ? `https://www.google.com/maps?q=${property.lat},${property.lng}`
      : null;

  return (
    <Stack gap={6} className="mx-auto max-w-5xl pb-24">
      <Flex wrap="wrap" align="center" justify="between" gap={4}>
        <Stack gap={1}>
          <Typography as="h1" variant="h1" className="text-3xl font-black tracking-tight text-brand-black">
            {t('details')}
          </Typography>
          <Typography as="p" variant="small" className="text-xs font-bold text-brand-slate">
            #{r.id}
          </Typography>
        </Stack>
        <RequestStatusBadge status={r.status} />
      </Flex>

      {/* Client info */}
      <Box className="card-premium p-8">
        <Typography as="h2" variant="h2" className="mb-4 text-sm font-black text-brand-slate uppercase tracking-widest">
          {tp('ownerInfo')}
        </Typography>
        <Grid gap={4} className="md:grid-cols-3">
          <Detail icon={<User size={16} />} label="" value={r.client_name} />
          <Detail icon={<Phone size={16} />} label="" value={r.client_phone} />
          <Detail icon={<Mail size={16} />} label="" value={r.client_email} />
        </Grid>
      </Box>

      {/* Property info */}
      {property && (
        <Box className="card-premium p-8">
          <Typography as="h2" variant="h2" className="mb-4 text-sm font-black text-brand-slate uppercase tracking-widest">
            {tp('myProperties')}
          </Typography>
          <Grid gap={4} className="md:grid-cols-3">
            <Detail icon={<Building2 size={16} />} label={tp('buildingName')} value={property.building_name} />
            <Detail icon={<Layers size={16} />} label={tp('floor')} value={property.floor_number} />
            <Detail icon={<Hash size={16} />} label={tp('unit')} value={property.unit_number} />
            <Detail icon={<Hash size={16} />} label={tp('doorCode')} value={property.door_code} />
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs font-black text-brand-accent hover:underline"
              >
                <MapPin size={14} /> {tp('location')}
              </a>
            )}
          </Grid>
        </Box>
      )}

      {/* Subscription info */}
      {subscription && (
        <Box className="card-premium p-8">
          <Typography as="h2" variant="h2" className="mb-4 text-sm font-black text-brand-slate uppercase tracking-widest">
            {ts('title')}
          </Typography>
          <Grid gap={4} className="md:grid-cols-3">
            <Detail label={ts('package')} value={subscription.package_name || subscription.package_id} />
            <Detail label={ts('startDate')} value={subscription.start_date} />
            <Detail label={ts('endDate')} value={subscription.end_date} />
          </Grid>
        </Box>
      )}

      {/* Schedule */}
      <Grid gap={4} className="card-premium p-8 md:grid-cols-2">
        <Detail
          icon={<Calendar size={16} />}
          label={t('scheduledAt')}
          value={formatDateTime(r.scheduled_at, locale)}
        />
        <Detail label={t('notes')} value={r.notes} />
      </Grid>

      {/* Status control */}
      <StatusUpdateControl
        requestId={r.id}
        current={r.status}
        guestConfirmed={!!r.guest_confirmed_at}
      />

      {/* Report */}
      {report ? <VisitReportView report={report} /> : <VisitReportForm requestId={r.id} />}
    </Stack>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label?: string;
  value?: string;
}) {
  return (
    <Stack gap={1}>
      {(icon || label) && (
        <Flex align="center" gap={2} className="text-[10px] font-black uppercase tracking-widest text-brand-slate">
          <>{icon}</>
          {label && <Box as="span">{label}</Box>}
        </Flex>
      )}
      <Typography as="p" variant="small" className="text-sm font-bold text-brand-black">
        {value || '—'}
      </Typography>
    </Stack>
  );
}
