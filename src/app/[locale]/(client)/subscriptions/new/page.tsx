import { getTranslations } from 'next-intl/server';
import { Stack, Typography } from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { SubscriptionForm } from '@/components/forms/subscription-form';
import type { Property } from '@/types/domain';

export default async function NewSubscriptionPage() {
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
      <Typography as="h1" variant="h1" className="text-3xl font-black tracking-tight text-brand-black">
        {t('newSubscription')}
      </Typography>
      <SubscriptionForm properties={properties} />
    </Stack>
  );
}
