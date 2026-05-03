import { getTranslations } from 'next-intl/server';
import { Stack, Typography } from '@amdlre/design-system';
import { PropertyForm } from '@/components/forms/property-form';

export default async function AddPropertyPage() {
  const t = await getTranslations('property');
  return (
    <Stack gap={6} className="mx-auto max-w-3xl pb-24">
      <Typography as="h1" variant="h1" className="text-3xl font-black tracking-tight text-brand-black">
        {t('addProperty')}
      </Typography>
      <PropertyForm />
    </Stack>
  );
}
