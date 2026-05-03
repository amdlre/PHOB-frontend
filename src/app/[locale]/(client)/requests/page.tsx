import Link from 'next/link';
import { Calendar, Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Box, Flex, Stack, Typography } from '@amdlre/design-system';
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
    <Stack gap={6} className="pb-24">
      <Flex align="center" justify="between">
        <Typography as="h1" variant="h1" className="text-3xl font-black tracking-tight text-brand-black">
          {t('myRequests')}
        </Typography>
        <Link href={`/${locale}/requests/new`} className="btn-primary">
          <Plus size={16} />
          <Box as="span">{t('newRequest')}</Box>
        </Link>
      </Flex>

      {requests.length === 0 ? (
        <Flex direction="col" align="center" gap={4} className="card-premium p-16 text-center">
          <Calendar size={40} className="text-brand-slate" strokeWidth={1.5} />
          <Typography as="p" variant="small" className="text-sm font-bold text-brand-slate">
            {t('noRequests')}
          </Typography>
        </Flex>
      ) : (
        <Stack gap={3}>
          {requests.map((r) => (
            <Link
              key={r.id}
              href={`/${locale}/requests/${r.id}`}
              className="card-premium flex flex-wrap items-center justify-between gap-4 p-6 transition-transform hover:-translate-y-0.5"
            >
              <Stack gap={1}>
                <Typography as="p" variant="small" className="text-sm font-black text-brand-black">
                  {r.property_name || r.property_id}
                </Typography>
                <Typography as="p" variant="small" className="text-xs font-bold text-brand-slate" dir="ltr">
                  {formatDateTime(r.scheduled_at, locale)}
                </Typography>
              </Stack>
              <RequestStatusBadge status={r.status} />
            </Link>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
