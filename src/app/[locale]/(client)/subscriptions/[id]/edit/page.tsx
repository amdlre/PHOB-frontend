import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { HeaderInfo, Stack } from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { SubscriptionForm } from '@/components/forms/subscription-form';
import type { Property, Subscription } from '@/types/domain';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditSubscriptionPage({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations('subscription');

  let subscription: Subscription | null = null;
  let properties: Property[] = [];
  try {
    const [s, p] = await Promise.all([
      api.get<Subscription>(ENDPOINTS.subscriptions.detail(id)),
      api.get<Property[]>(ENDPOINTS.properties.list),
    ]);
    subscription = s.data;
    properties = p.data;
  } catch {
    notFound();
  }

  return (
    <Stack gap={6} className="mx-auto max-w-4xl pb-24">
      <HeaderInfo
        size="md"
        title={t('editSubscription')}
        subtitle={subscription!.property_name ?? subscription!.property_id}
        backHref={`/${locale}/subscriptions`}
      />
      <SubscriptionForm properties={properties} subscription={subscription!} />
    </Stack>
  );
}
