import { getTranslations } from 'next-intl/server';
import { HeaderInfo, Stack } from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { RequestsTable } from '@/components/dashboard/requests-table';
import type { CleaningRequest } from '@/types/domain';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function EmployeeRequestsPage({ params }: PageProps) {
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
      <HeaderInfo title={t('allRequests')} />
      <RequestsTable
        requests={requests}
        hrefBase={`/${locale}/employee/requests`}
        showClient
      />
    </Stack>
  );
}
