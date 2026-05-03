'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import {
  Box,
  Button,
  Card,
  Grid,
  Input,
  Label,
  Stack,
  Typography,
} from '@amdlre/design-system';
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={6}>
        {serverError ? (
          <Box className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
            {serverError}
          </Box>
        ) : null}

        <Card className="card-premium p-8">
          <Stack gap={5}>
            <Grid gap={5} className="md:grid-cols-2">
              {inputs.map((field) => (
                <Stack key={field.name} gap={2} className="text-right">
                  <Label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
                    {field.label}
                  </Label>
                  <Input
                    placeholder={field.placeholder}
                    className="input-base text-right"
                    {...register(field.name as 'building_name')}
                  />
                  {errors[field.name] ? (
                    <Typography as="p" variant="small" className="text-xs font-bold text-red-500">
                      {(errors[field.name] as { message?: string })?.message}
                    </Typography>
                  ) : null}
                </Stack>
              ))}
            </Grid>

            <Stack gap={2} className="text-right">
              <Label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
                {t('address')}
              </Label>
              <Input className="input-base text-right" {...register('address')} />
            </Stack>
          </Stack>
        </Card>

        <Card className="card-premium p-8">
          <Stack gap={3}>
            <Typography as="h3" variant="small" className="font-black text-brand-black">
              {t('images')}
            </Typography>
            <Typography as="p" variant="small" className="text-xs font-bold text-brand-slate">
              {t('imagesHint')}
            </Typography>
            <ImageUploader value={images} onChange={setImages} />
          </Stack>
        </Card>

        <Card className="card-premium p-8">
          <Stack gap={3}>
            <Typography as="h3" variant="small" className="font-black text-brand-black">
              {t('location')}
            </Typography>
            <Typography as="p" variant="small" className="text-xs font-bold text-brand-slate">
              {t('locationHint')}
            </Typography>
            <GoogleMapPicker onChange={(lat, lng) => setCoords({ lat, lng })} />
            {coords.lat ? (
              <Typography
                as="p"
                variant="small"
                className="text-[11px] font-bold text-brand-slate"
                dir="ltr"
              >
                lat: {coords.lat.toFixed(5)}, lng: {coords.lng?.toFixed(5)}
              </Typography>
            ) : null}
          </Stack>
        </Card>

        <Button
          type="submit"
          disabled={pending}
          rightIcon={<ArrowLeft size={18} />}
          className="w-full rounded-2xl bg-brand-black py-5 text-sm font-black text-white shadow-xl hover:bg-brand-accent disabled:opacity-60"
        >
          {pending ? '...' : t('addProperty')}
        </Button>
      </Stack>
    </form>
  );
}
