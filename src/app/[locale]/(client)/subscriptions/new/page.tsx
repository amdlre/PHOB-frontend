import { getTranslations } from 'next-intl/server';
import { HeaderInfo, Stack } from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { SubscriptionForm } from '@/components/forms/subscription-form';
import type { Property } from '@/types/domain';
import type { PageProps } from '@/types';

export default async function NewSubscriptionPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('subscription');
  let properties: Property[] = [];
  try {
    const res = await api.get<Property[]>(ENDPOINTS.properties.list);
    properties = res.data;
  } catch {
    properties = [];
  }

  return (
    <Stack gap={6} className="mx-auto max-w-4xl pb-24">
      <HeaderInfo
        size="md"
        title={t('newSubscription')}
        subtitle={t('selectPackage')}
        backHref={`/${locale}/subscriptions`}
      />
      <SubscriptionForm properties={properties} />
    </Stack>
  );
}
