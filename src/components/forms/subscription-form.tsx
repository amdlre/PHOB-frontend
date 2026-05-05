'use client';

import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Building2, CalendarDays, Check, Sparkles } from 'lucide-react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CustomInput,
  Field,
  Flex,
  Grid,
  NativeSelect,
  Stack,
  Typography,
  WizardForm,
  type WizardFormStep,
} from '@amdlre/design-system';
import { PACKAGES } from '@/constants/packages';
import { createSubscriptionAction, updateSubscriptionAction } from '@/actions/subscriptions';
import { subscriptionSchema, type SubscriptionFormData } from '@/lib/validations/subscription';
import type { Property, Subscription } from '@/types/domain';

interface Props {
  properties: Property[];
  /** Pass an existing subscription to render the form in edit mode. */
  subscription?: Subscription;
}

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function SubscriptionForm({ properties, subscription }: Props) {
  const t = useTranslations('subscription');
  const tc = useTranslations('common');
  const tWiz = useTranslations('dashboard.wizard');
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const isEdit = !!subscription;

  const form = useForm<SubscriptionFormData>({
    // zod v4 + DS's bundled RHF version differ on input/output inference; the runtime contract is correct.
    resolver: zodResolver(subscriptionSchema) as never,
    defaultValues: {
      property_id: subscription?.property_id ?? properties[0]?.id ?? '',
      package_id: subscription?.package_id ?? 'one_br',
      start_date: subscription?.start_date ?? todayPlus(3),
      end_date: subscription?.end_date ?? todayPlus(33),
      is_renewal: subscription?.is_renewal ?? false,
    },
    mode: 'onBlur',
  });

  const propertyId = form.watch('property_id');
  const packageId = form.watch('package_id');
  const startDate = form.watch('start_date');
  const endDate = form.watch('end_date');

  const selectedProperty = properties.find((p) => p.id === propertyId);
  const isRenewal = !!selectedProperty?.has_active_subscription;
  const minStart = isRenewal ? todayPlus(1) : todayPlus(3);

  const selectedPackage = useMemo(() => PACKAGES.find((p) => p.id === packageId), [packageId]);

  const [submitting, setSubmitting] = useState(false);

  const steps: WizardFormStep<SubscriptionFormData>[] = [
    {
      id: 'property',
      title: t('selectProperty'),
      icon: <Building2 className="h-4 w-4" />,
      fields: ['property_id', 'start_date', 'end_date'],
    },
    {
      id: 'package',
      title: t('selectPackage'),
      icon: <Sparkles className="h-4 w-4" />,
      fields: ['package_id'],
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
        submit: t('confirmSubscription'),
      }}
      onComplete={async (rawValues) => {
        const values = rawValues as SubscriptionFormData;
        setSubmitting(true);
        const res = isEdit
          ? await updateSubscriptionAction(subscription!.id, {
              package_id: values.package_id,
              start_date: values.start_date,
              end_date: values.end_date,
            })
          : await createSubscriptionAction({ ...values, is_renewal: isRenewal });
        setSubmitting(false);
        if (!res.success) return { message: res.message || 'حدث خطأ' };
        router.push(`/${params.locale}/subscriptions`);
        router.refresh();
      }}
    >
      {/* Step 1: property + dates */}
      <Card className="card-premium">
        <CardContent className="space-y-5 p-8">
          <Field label={t('selectProperty')} error={form.formState.errors.property_id?.message}>
            <Controller
              control={form.control}
              name="property_id"
              render={({ field }) => (
                <NativeSelect
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="text-right"
                >
                  {properties.length === 0 ? <option value="">—</option> : null}
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.building_name} {p.unit_number ? `· ${p.unit_number}` : ''}
                    </option>
                  ))}
                </NativeSelect>
              )}
            />
          </Field>

          <Box className="rounded-2xl border border-brand-border bg-brand-offwhite p-4 text-xs font-bold leading-relaxed text-brand-slate">
            <Flex align="center" gap={2}>
              <CalendarDays size={14} />
              {isRenewal ? t('rules.renewalMinDate') : t('rules.newPropertyMinDate')}
            </Flex>
          </Box>

          <Grid gap={4} className="md:grid-cols-2">
            <CustomInput
              label={t('startDate')}
              type="date"
              isRequired
              min={minStart}
              error={form.formState.errors.start_date?.message}
              {...form.register('start_date')}
            />
            <CustomInput
              label={t('endDate')}
              type="date"
              isRequired
              error={form.formState.errors.end_date?.message}
              {...form.register('end_date')}
            />
          </Grid>
        </CardContent>
      </Card>

      {/* Step 2: package */}
      <Stack gap={3}>
        <Typography as="h3" variant="small" className="font-black text-brand-black">
          {t('selectPackage')}
        </Typography>
        <Controller
          control={form.control}
          name="package_id"
          render={({ field }) => (
            <Grid gap={4} className="md:grid-cols-3">
              {PACKAGES.map((pk) => {
                const active = pk.id === field.value;
                return (
                  <Button
                    key={pk.id}
                    type="button"
                    variant="outline"
                    onClick={() => field.onChange(pk.id)}
                    className={`card-premium flex h-auto flex-col items-stretch gap-3 p-6 text-right transition-all ${
                      active ? 'border-brand-accent ring-4 ring-brand-accent/10' : ''
                    }`}
                  >
                    <Flex align="center" justify="between">
                      <Typography as="h4" variant="large" className="font-black text-brand-black">
                        {pk.name}
                      </Typography>
                      {active ? (
                        <Flex
                          as="span"
                          align="center"
                          justify="center"
                          className="h-6 w-6 rounded-full bg-brand-accent text-white"
                        >
                          <Check size={14} />
                        </Flex>
                      ) : null}
                    </Flex>
                    <Flex align="baseline" gap={1} direction="rowReverse">
                      <Typography as="span" variant="h2" className="text-3xl font-black text-brand-black">
                        {pk.price}
                      </Typography>
                      <Typography as="span" variant="small" className="text-xs font-bold text-brand-slate">
                        {tc('currency')} {tc('perMonth')}
                      </Typography>
                    </Flex>
                    <Stack as="ul" gap={1}>
                      {pk.features.map((f, i) => (
                        <Flex key={i} as="li" align="center" gap={2}>
                          <Sparkles size={10} className="text-brand-accent" />
                          <Typography as="span" variant="small" className="text-xs font-bold text-brand-slate">
                            {f}
                          </Typography>
                        </Flex>
                      ))}
                    </Stack>
                  </Button>
                );
              })}
            </Grid>
          )}
        />

        {selectedPackage ? (
          <Card className="card-premium">
            <CardContent className="space-y-2 p-6 text-right">
              <Typography
                as="h4"
                variant="small"
                className="text-xs font-black uppercase tracking-widest text-brand-slate"
              >
                {t('summary')}
              </Typography>
              <Flex align="center" justify="between">
                <Typography as="span" variant="small" className="font-bold text-brand-black">
                  {selectedPackage.name}
                </Typography>
                <Typography as="span" variant="small" className="font-bold text-brand-black">
                  {selectedPackage.price} {tc('currency')}
                </Typography>
              </Flex>
              <Flex align="center" justify="between">
                <Typography as="span" variant="small" className="font-bold text-brand-slate">
                  {t('startDate')}
                </Typography>
                <Typography as="span" variant="small" className="font-bold text-brand-slate" dir="ltr">
                  {startDate}
                </Typography>
              </Flex>
              <Flex align="center" justify="between">
                <Typography as="span" variant="small" className="font-bold text-brand-slate">
                  {t('endDate')}
                </Typography>
                <Typography as="span" variant="small" className="font-bold text-brand-slate" dir="ltr">
                  {endDate}
                </Typography>
              </Flex>
              {submitting ? (
                <Typography as="p" variant="small" className="text-xs font-bold text-brand-slate">
                  …
                </Typography>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
      </Stack>
    </WizardForm>
  );
}
