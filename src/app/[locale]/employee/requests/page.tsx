import Link from 'next/link';
import { Search } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import {
  Box,
  Button,
  Input,
  NativeSelect,
  Stack,
  Typography,
} from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { formatDateTime } from '@/lib/utils';
import { RequestStatusBadge } from '@/components/shared/request-status-badge';
import type { CleaningRequest, RequestStatus } from '@/types/domain';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function EmployeeRequestsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations('request');

  const filters = {
    client: sp.client,
    phone: sp.phone,
    building: sp.building,
    unit: sp.unit,
    status: sp.status,
    from: sp.from,
    to: sp.to,
  };

  let requests: CleaningRequest[] = [];
  try {
    const res = await api.get<CleaningRequest[]>(ENDPOINTS.requests.list, { params: filters });
    requests = res.data;
  } catch {
    requests = [];
  }

  const STATUSES: RequestStatus[] = [
    'pending',
    'scheduled',
    'awaiting_guest_confirmation',
    'in_progress',
    'completed',
    'rejected',
  ];

  return (
    <Stack gap={6} className="pb-24">
      <Typography as="h1" variant="h1" className="text-3xl font-black tracking-tight text-brand-black">
        {t('allRequests')}
      </Typography>

      <form className="card-premium grid gap-3 p-6 md:grid-cols-3 lg:grid-cols-6">
        <FilterInput name="client" placeholder={t('filters.client')} defaultValue={filters.client} />
        <FilterInput name="phone" placeholder={t('filters.phone')} defaultValue={filters.phone} />
        <FilterInput name="building" placeholder={t('filters.building')} defaultValue={filters.building} />
        <FilterInput name="unit" placeholder={t('filters.unit')} defaultValue={filters.unit} />
        <NativeSelect
          name="status"
          defaultValue={filters.status ?? ''}
          className="input-base text-right"
        >
          <option value="">{t('filters.status')}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`statuses.${s}`)}
            </option>
          ))}
        </NativeSelect>
        <Button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand-black py-3 text-xs font-black text-white"
        >
          <Search size={14} />
          {t('filters.search')}
        </Button>
      </form>

      {requests.length === 0 ? (
        <Box className="card-premium p-12 text-center text-sm font-bold text-brand-slate">
          {t('noRequests')}
        </Box>
      ) : (
        <Stack gap={3}>
          {requests.map((r) => (
            <Link
              key={r.id}
              href={`/${locale}/employee/requests/${r.id}`}
              className="card-premium grid grid-cols-1 items-center gap-3 p-5 sm:grid-cols-4"
            >
              <Stack gap={1}>
                <Typography as="p" variant="small" className="text-sm font-black text-brand-black">
                  {r.client_name || '—'}
                </Typography>
                <Typography as="p" variant="small" className="text-[11px] font-bold text-brand-slate" dir="ltr">
                  {r.client_phone}
                </Typography>
              </Stack>
              <Typography as="p" variant="small" className="text-sm font-bold text-brand-black">
                {r.property_name}
              </Typography>
              <Typography as="p" variant="small" className="text-xs font-bold text-brand-slate" dir="ltr">
                {formatDateTime(r.scheduled_at, locale)}
              </Typography>
              <Box className="justify-self-end">
                <RequestStatusBadge status={r.status} />
              </Box>
            </Link>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

function FilterInput({
  name,
  placeholder,
  defaultValue,
}: {
  name: string;
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <Input
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue ?? ''}
      className="input-base text-right"
    />
  );
}
