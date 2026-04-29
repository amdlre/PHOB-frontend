import { getTranslations } from 'next-intl/server';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { CleaningRequestForm } from '@/components/forms/cleaning-request-form';
import type { Property } from '@/types/domain';

export default async function NewRequestPage() {
  const t = await getTranslations('request');
  let properties: Property[] = [];
  try {
    const res = await api.get<Property[]>(ENDPOINTS.properties.list);
    properties = res.data;
  } catch {
    properties = [];
  }
  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <h1 className="text-3xl font-black tracking-tight text-brand-black">{t('newRequest')}</h1>
      <CleaningRequestForm properties={properties} />
    </div>
  );
}
