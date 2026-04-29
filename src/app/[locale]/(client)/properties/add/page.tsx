import { getTranslations } from 'next-intl/server';
import { PropertyForm } from '@/components/forms/property-form';

export default async function AddPropertyPage() {
  const t = await getTranslations('property');
  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <h1 className="text-3xl font-black tracking-tight text-brand-black">{t('addProperty')}</h1>
      <PropertyForm />
    </div>
  );
}
