import { notFound } from 'next/navigation';
import { Calendar, Pencil, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Box, Button, Flex, Grid, HeaderInfo, Stack, Typography } from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { formatDate } from '@/lib/utils';
import type { Subscription, SubscriptionStatus } from '@/types/domain';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

const STATUS_STYLES: Record<SubscriptionStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  expired: 'bg-slate-100 text-slate-700 border-slate-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default async function EmployeeSubscriptionDetailPage({ params }: Props) {
  const { id, locale } = await params;
  const t = await getTranslations('subscription');
  const ts = await getTranslations('subscription.statuses');
  const tCommon = await getTranslations('common');

  let subscription: Subscription | null = null;
  try {
    const res = await api.get<Subscription>(ENDPOINTS.subscriptions.detail(id));
    subscription = res.data;
  } catch {
    notFound();
  }

  const s = subscription!;

  return (
    <Stack gap={6} className="pb-24">
      <HeaderInfo
        size="md"
        title={s.property_name ?? s.property_id}
        subtitle={`#${s.id}`}
        backHref={`/${locale}/employee/subscriptions`}
        actions={
          <>
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                STATUS_STYLES[s.status] ?? STATUS_STYLES.pending
              }`}
            >
              {ts(s.status)}
            </span>
            <Button
              href={`/${locale}/employee/subscriptions/${s.id}/edit`}
              variant="outline"
              leftIcon={<Pencil size={14} />}
            >
              {tCommon('edit')}
            </Button>
          </>
        }
      />

      <Box className="card-premium p-8">
        <Grid gap={4} className="md:grid-cols-3">
          <Detail icon={<Sparkles size={16} />} label={t('package')} value={s.package_name || s.package_id} />
          <Detail icon={<Calendar size={16} />} label={t('startDate')} value={formatDate(s.start_date, locale)} />
          <Detail icon={<Calendar size={16} />} label={t('endDate')} value={formatDate(s.end_date, locale)} />
        </Grid>
      </Box>
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
        <Flex
          align="center"
          gap={2}
          className="text-[10px] font-black uppercase tracking-widest text-brand-slate"
        >
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
