import { getTranslations } from 'next-intl/server';
import { HeaderInfo, Stack } from '@amdlre/design-system';
import { PropertyForm } from '@/components/forms/property-form';
import type { PageProps } from '@/types';

export default async function AddPropertyPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('property');
  return (
    <Stack gap={6} className="mx-auto max-w-3xl pb-24">
      <HeaderInfo
        size="md"
        title={t('addProperty')}
        subtitle={t('imagesHint')}
        backHref={`/${locale}/properties`}
      />
      <PropertyForm />
    </Stack>
  );
}
