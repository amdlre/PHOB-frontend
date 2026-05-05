import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Button, HeaderInfo, Stack } from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { SubscriptionsTable } from '@/components/dashboard/subscriptions-table';
import type { Subscription } from '@/types/domain';
import type { PageProps } from '@/types';

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
    <Stack gap={6} className="pb-24">
      <HeaderInfo
        title={t('title')}
        actions={
          <Button href={`/${locale}/subscriptions/new`} leftIcon={<Plus size={16} />}>
            {t('newSubscription')}
          </Button>
        }
      />
      <SubscriptionsTable subscriptions={subs} />
    </Stack>
  );
}
