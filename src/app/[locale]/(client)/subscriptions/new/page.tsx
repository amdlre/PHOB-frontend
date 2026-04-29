import { getTranslations } from 'next-intl/server';
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
    <div className="mx-auto max-w-4xl space-y-6 pb-24">
      <h1 className="text-3xl font-black tracking-tight text-brand-black">{t('newSubscription')}</h1>
      <SubscriptionForm properties={properties} />
    </div>
  );
}
