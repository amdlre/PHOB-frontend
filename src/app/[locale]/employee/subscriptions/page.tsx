import { getTranslations } from 'next-intl/server';
import { HeaderInfo, Stack } from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { SubscriptionsTable } from '@/components/dashboard/subscriptions-table';
import type { Subscription } from '@/types/domain';

export default async function EmployeeSubscriptionsPage() {
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
      <HeaderInfo title={t('title')} />
      <SubscriptionsTable subscriptions={subs} />
    </Stack>
  );
}
