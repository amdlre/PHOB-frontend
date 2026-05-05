import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { HeaderInfo, Stack } from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { PropertyForm } from '@/components/forms/property-form';
import type { Property } from '@/types/domain';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditPropertyPage({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations('property');

  let property: Property | null = null;
  try {
    const res = await api.get<Property>(ENDPOINTS.properties.detail(id));
    property = res.data;
  } catch {
    notFound();
  }

  return (
    <Stack gap={6} className="mx-auto max-w-3xl pb-24">
      <HeaderInfo
        size="md"
        title={t('editProperty')}
        subtitle={property!.building_name}
        backHref={`/${locale}/properties/${id}`}
      />
      <PropertyForm property={property!} />
    </Stack>
  );
}
