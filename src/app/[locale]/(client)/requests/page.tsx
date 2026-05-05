import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Button, HeaderInfo, Stack } from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { OrdersList } from '@/components/dashboard/orders-list';
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
      <HeaderInfo
        title={t('myRequests')}
        actions={
          <Button href={`/${locale}/requests/new`} leftIcon={<Plus size={16} />}>
            {t('newRequest')}
          </Button>
        }
      />
      <OrdersList requests={requests} hrefBase={`/${locale}/requests`} />
    </Stack>
  );
}
