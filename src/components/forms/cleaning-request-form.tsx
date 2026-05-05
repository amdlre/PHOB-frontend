'use client';

import { useState, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AlertCircle, Building2, CalendarClock } from 'lucide-react';
import {
  Box,
  Card,
  CardContent,
  CustomInput,
  CustomTextarea,
  Field,
  Flex,
  Grid,
  NativeSelect,
  WizardForm,
  type WizardFormStep,
} from '@amdlre/design-system';
import { createCleaningRequestAction } from '@/actions/requests';
import {
  cleaningRequestSchema,
  type CleaningRequestFormData,
} from '@/lib/validations/request';
import type { Property } from '@/types/domain';

interface Props {
  properties: Property[];
}

function defaultScheduledAt(): string {
  const d = new Date(Date.now() + 13 * 60 * 60 * 1000);
  d.setMinutes(0, 0, 0);
  return d.toISOString().slice(0, 16);
}

export function CleaningRequestForm({ properties }: Props) {
  const t = useTranslations('request');
  const tWiz = useTranslations('dashboard.wizard');
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const [, startTransition] = useTransition();

  const subscribed = properties.filter((p) => p.has_active_subscription);

  const form = useForm<CleaningRequestFormData>({
    // zod v4 + DS's bundled RHF version differ on input/output inference; the runtime contract is correct.
    resolver: zodResolver(cleaningRequestSchema) as never,
    defaultValues: {
      property_id: subscribed[0]?.id ?? '',
      scheduled_at: defaultScheduledAt(),
      cleaning_type: 'checkout',
      notes: '',
    },
    mode: 'onBlur',
  });

  const [submitting, setSubmitting] = useState(false);

  const steps: WizardFormStep<CleaningRequestFormData>[] = [
    {
      id: 'property',
      title: t('selectProperty'),
      icon: <Building2 className="h-4 w-4" />,
      fields: ['property_id'],
    },
    {
      id: 'schedule',
      title: t('scheduledAt'),
      icon: <CalendarClock className="h-4 w-4" />,
      fields: ['scheduled_at', 'cleaning_type', 'notes'],
    },
  ];

  return (
    <>
      {subscribed.length === 0 ? (
        <Box className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
          <Flex align="center" gap={2}>
            <AlertCircle size={16} />
            {t('rules.noActiveSub')}
          </Flex>
        </Box>
      ) : null}

      <WizardForm
        // The DS bundles a different RHF version under its own node_modules; runtime is fine, types diverge.
        form={form as never}
        steps={steps as never}
        labels={{ back: tWiz('back'), next: tWiz('next'), submit: t('submit') }}
        onComplete={async (rawValues) =>
          new Promise((resolve) => {
            const values = rawValues as CleaningRequestFormData;
            setSubmitting(true);
            startTransition(async () => {
              const res = await createCleaningRequestAction({
                ...values,
                scheduled_at: new Date(values.scheduled_at).toISOString(),
              });
              setSubmitting(false);
              if (!res.success) {
                resolve({ message: res.message || t('rules.min12h') });
                return;
              }
              router.push(`/${params.locale}/requests`);
              router.refresh();
              resolve();
            });
          })
        }
      >
        {/* Step 1: property */}
        <Card className="card-premium">
          <CardContent className="space-y-5 p-8">
            <Field
              label={t('selectProperty')}
              error={form.formState.errors.property_id?.message}
            >
              <Controller
                control={form.control}
                name="property_id"
                render={({ field }) => (
                  <NativeSelect
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="text-right"
                    disabled={subscribed.length === 0}
                  >
                    {subscribed.length === 0 ? <option value="">—</option> : null}
                    {subscribed.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.building_name} {p.unit_number ? `· ${p.unit_number}` : ''}
                      </option>
                    ))}
                  </NativeSelect>
                )}
              />
            </Field>
          </CardContent>
        </Card>

        {/* Step 2: schedule + type + notes */}
        <Card className="card-premium">
          <CardContent className="space-y-5 p-8">
            <Grid gap={4} className="md:grid-cols-2">
              <CustomInput
                label={t('scheduledAt')}
                isRequired
                type="datetime-local"
                error={form.formState.errors.scheduled_at?.message}
                {...form.register('scheduled_at')}
              />
              <Field label={t('type')} error={form.formState.errors.cleaning_type?.message}>
                <Controller
                  control={form.control}
                  name="cleaning_type"
                  render={({ field }) => (
                    <NativeSelect
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="text-right"
                    >
                      <option value="checkout">{t('types.checkout')}</option>
                      <option value="regular">{t('types.regular')}</option>
                      <option value="deep">{t('types.deep')}</option>
                    </NativeSelect>
                  )}
                />
              </Field>
            </Grid>
            <CustomTextarea
              label={t('notes')}
              rows={4}
              placeholder={t('notesPlaceholder')}
              error={form.formState.errors.notes?.message}
              {...form.register('notes')}
            />
            {submitting ? (
              <Box className="text-xs font-bold text-brand-slate">…</Box>
            ) : null}
          </CardContent>
        </Card>
      </WizardForm>
    </>
  );
}
