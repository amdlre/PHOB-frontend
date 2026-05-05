'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Building2, ImageIcon, MapPin } from 'lucide-react';
import {
  Card,
  CardContent,
  CustomInput,
  Grid,
  Typography,
  WizardForm,
  type WizardFormStep,
} from '@amdlre/design-system';
import { propertySchema, type PropertyFormData } from '@/lib/validations/property';
import { createPropertyAction, updatePropertyAction } from '@/actions/properties';
import { GoogleMapPicker } from '@/components/shared/google-map-picker';
import { ImageUploader } from '@/components/shared/image-uploader';
import type { Property } from '@/types/domain';

interface Props {
  /** Pass an existing property to render the form in edit mode. */
  property?: Property;
}

export function PropertyForm({ property }: Props = {}) {
  const t = useTranslations('property');
  const tWiz = useTranslations('dashboard.wizard');
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const [, startTransition] = useTransition();
  const isEdit = !!property;
  const [images, setImages] = useState<string[]>(property?.images ?? []);
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({
    lat: property?.lat,
    lng: property?.lng,
  });

  const form = useForm<PropertyFormData>({
    // zod v4 + DS's bundled RHF version differ on input/output inference; the runtime contract is correct.
    resolver: zodResolver(propertySchema) as never,
    defaultValues: {
      building_name: property?.building_name ?? '',
      floor_number: property?.floor_number ?? '',
      unit_number: property?.unit_number ?? '',
      door_code: property?.door_code ?? '',
      address: property?.address ?? '',
    },
    mode: 'onBlur',
  });

  const {
    register,
    formState: { errors },
  } = form;

  const steps: WizardFormStep<PropertyFormData>[] = [
    {
      id: 'basic',
      title: t('buildingName'),
      icon: <Building2 className="h-4 w-4" />,
      fields: ['building_name', 'floor_number', 'unit_number', 'door_code', 'address'],
    },
    {
      id: 'images',
      title: t('images'),
      icon: <ImageIcon className="h-4 w-4" />,
    },
    {
      id: 'location',
      title: t('location'),
      icon: <MapPin className="h-4 w-4" />,
    },
  ];

  return (
    <WizardForm
      // The DS bundles a different RHF version under its own node_modules; runtime is fine, types diverge.
      form={form as never}
      steps={steps as never}
      labels={{
        back: tWiz('back'),
        next: tWiz('next'),
        submit: isEdit ? t('editProperty') : t('addProperty'),
      }}
      onComplete={async (rawValues) =>
        new Promise((resolve) => {
          const values = rawValues as PropertyFormData;
          startTransition(async () => {
            const payload = {
              ...values,
              images,
              lat: coords.lat,
              lng: coords.lng,
            };
            const res = isEdit
              ? await updatePropertyAction(property!.id, payload)
              : await createPropertyAction(payload);
            if (!res.success) {
              resolve({ message: res.message || 'حدث خطأ' });
              return;
            }
            router.push(
              isEdit
                ? `/${params.locale}/properties/${property!.id}`
                : `/${params.locale}/properties`,
            );
            router.refresh();
            resolve();
          });
        })
      }
    >
      {/* Step 1: basic info */}
      <Card className="card-premium">
        <CardContent className="space-y-5 p-8">
          <Grid gap={5} className="md:grid-cols-2">
            <CustomInput
              label={t('buildingName')}
              isRequired
              placeholder={t('buildingNamePlaceholder')}
              error={errors.building_name?.message}
              {...register('building_name')}
            />
            <CustomInput
              label={t('floor')}
              placeholder={t('floorPlaceholder')}
              error={errors.floor_number?.message}
              {...register('floor_number')}
            />
            <CustomInput
              label={t('unit')}
              placeholder={t('unitPlaceholder')}
              error={errors.unit_number?.message}
              {...register('unit_number')}
            />
            <CustomInput
              label={t('doorCode')}
              placeholder={t('doorCodePlaceholder')}
              error={errors.door_code?.message}
              {...register('door_code')}
            />
          </Grid>
          <CustomInput
            label={t('address')}
            error={errors.address?.message}
            {...register('address')}
          />
        </CardContent>
      </Card>

      {/* Step 2: images */}
      <Card className="card-premium">
        <CardContent className="space-y-3 p-8">
          <Typography as="h3" variant="small" className="font-black text-brand-black">
            {t('images')}
          </Typography>
          <Typography as="p" variant="small" className="text-xs font-bold text-brand-slate">
            {t('imagesHint')}
          </Typography>
          <ImageUploader value={images} onChange={setImages} />
        </CardContent>
      </Card>

      {/* Step 3: location */}
      <Card className="card-premium">
        <CardContent className="space-y-3 p-8">
          <Typography as="h3" variant="small" className="font-black text-brand-black">
            {t('location')}
          </Typography>
          <Typography as="p" variant="small" className="text-xs font-bold text-brand-slate">
            {t('locationHint')}
          </Typography>
          <GoogleMapPicker onChange={(lat, lng) => setCoords({ lat, lng })} />
          {coords.lat ? (
            <Typography as="p" variant="small" className="text-[11px] font-bold text-brand-slate" dir="ltr">
              lat: {coords.lat.toFixed(5)}, lng: {coords.lng?.toFixed(5)}
            </Typography>
          ) : null}
        </CardContent>
      </Card>
    </WizardForm>
  );
}
