'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { propertySchema, type PropertyFormData } from '@/lib/validations/property';
import { createPropertyAction } from '@/actions/properties';
import { GoogleMapPicker } from '@/components/shared/google-map-picker';
import { ImageUploader } from '@/components/shared/image-uploader';

export function PropertyForm() {
  const t = useTranslations('property');
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      building_name: '',
      floor_number: '',
      unit_number: '',
      door_code: '',
      address: '',
      images: [],
    },
  });

  const onSubmit = (data: PropertyFormData) => {
    setServerError(null);
    startTransition(async () => {
      const res = await createPropertyAction({
        ...data,
        images,
        lat: coords.lat,
        lng: coords.lng,
      });
      if (!res.success) {
        setServerError(res.message || 'حدث خطأ');
        return;
      }
      router.push(`/${params.locale}/properties`);
      router.refresh();
    });
  };

  const inputs: Array<{
    name: keyof PropertyFormData;
    label: string;
    placeholder?: string;
  }> = [
    { name: 'building_name', label: t('buildingName'), placeholder: t('buildingNamePlaceholder') },
    { name: 'floor_number', label: t('floor'), placeholder: t('floorPlaceholder') },
    { name: 'unit_number', label: t('unit'), placeholder: t('unitPlaceholder') },
    { name: 'door_code', label: t('doorCode'), placeholder: t('doorCodePlaceholder') },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {serverError}
        </div>
      )}

      <div className="card-premium space-y-5 p-8">
        <div className="grid gap-5 md:grid-cols-2">
          {inputs.map((field) => (
            <div key={field.name} className="space-y-2 text-right">
              <label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
                {field.label}
              </label>
              <input
                placeholder={field.placeholder}
                className="input-base text-right"
                {...register(field.name as 'building_name')}
              />
              {errors[field.name] && (
                <p className="text-xs font-bold text-red-500">
                  {(errors[field.name] as { message?: string })?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2 text-right">
          <label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
            {t('address')}
          </label>
          <input className="input-base text-right" {...register('address')} />
        </div>
      </div>

      <div className="card-premium space-y-3 p-8">
        <h3 className="text-sm font-black text-brand-black">{t('images')}</h3>
        <p className="text-xs font-bold text-brand-slate">{t('imagesHint')}</p>
        <ImageUploader value={images} onChange={setImages} />
      </div>

      <div className="card-premium space-y-3 p-8">
        <h3 className="text-sm font-black text-brand-black">{t('location')}</h3>
        <p className="text-xs font-bold text-brand-slate">{t('locationHint')}</p>
        <GoogleMapPicker onChange={(lat, lng) => setCoords({ lat, lng })} />
        {coords.lat && (
          <p className="text-[11px] font-bold text-brand-slate" dir="ltr">
            lat: {coords.lat.toFixed(5)}, lng: {coords.lng?.toFixed(5)}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-black py-5 text-sm font-black text-white shadow-xl transition-all hover:bg-brand-accent active:scale-95 disabled:opacity-60"
      >
        <span>{pending ? '...' : t('addProperty')}</span>
        <ArrowLeft size={18} />
      </button>
    </form>
  );
}
