import { getTranslations } from 'next-intl/server';
import { HeaderInfo, Stack } from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { CleaningRequestForm } from '@/components/forms/cleaning-request-form';
import type { Property } from '@/types/domain';
import type { PageProps } from '@/types';

export default async function NewRequestPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('request');
  let properties: Property[] = [];
  try {
    const res = await api.get<Property[]>(ENDPOINTS.properties.list);
    properties = res.data;
  } catch {
    properties = [];
  }
  return (
    <Stack gap={6} className="mx-auto max-w-3xl pb-24">
      <HeaderInfo
        size="md"
        title={t('newRequest')}
        subtitle={t('rules.min12h')}
        backHref={`/${locale}/requests`}
      />
      <CleaningRequestForm properties={properties} />
    </Stack>
  );
}
