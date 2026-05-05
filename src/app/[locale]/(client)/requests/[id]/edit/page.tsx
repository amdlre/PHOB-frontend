import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { HeaderInfo, Stack } from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { CleaningRequestForm } from '@/components/forms/cleaning-request-form';
import type { CleaningRequest, Property } from '@/types/domain';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditRequestPage({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations('request');

  let request: CleaningRequest | null = null;
  let properties: Property[] = [];
  try {
    const [r, p] = await Promise.all([
      api.get<CleaningRequest>(ENDPOINTS.requests.detail(id)),
      api.get<Property[]>(ENDPOINTS.properties.list),
    ]);
    request = r.data;
    properties = p.data;
  } catch {
    notFound();
  }

  return (
    <Stack gap={6} className="mx-auto max-w-3xl pb-24">
      <HeaderInfo
        size="md"
        title={t('editRequest')}
        subtitle={request!.property_name ?? `#${request!.id}`}
        backHref={`/${locale}/requests/${id}`}
      />
      <CleaningRequestForm properties={properties} request={request!} />
    </Stack>
  );
}
