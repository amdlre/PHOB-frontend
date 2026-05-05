import { getTranslations } from 'next-intl/server';
import { HeaderInfo, Stack } from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { PropertiesTable } from '@/components/dashboard/properties-table';
import type { Property } from '@/types/domain';

export default async function EmployeePropertiesPage() {
  const t = await getTranslations('property');

  let properties: (Property & { owner_name?: string; owner_phone?: string })[] = [];
  try {
    const res = await api.get<Property[]>(ENDPOINTS.properties.list);
    properties = res.data;
  } catch {
    properties = [];
  }

  return (
    <Stack gap={6} className="pb-24">
      <HeaderInfo title={t('allProperties')} />
      <PropertiesTable properties={properties} />
    </Stack>
  );
}
