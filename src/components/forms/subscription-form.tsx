'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Input,
  Label,
  NativeSelect,
  Stack,
  Typography,
} from '@amdlre/design-system';
import { PACKAGES } from '@/constants/packages';
import { createSubscriptionAction } from '@/actions/subscriptions';
import type { Property, PackageId } from '@/types/domain';

interface Props {
  properties: Property[];
}

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function SubscriptionForm({ properties }: Props) {
  const t = useTranslations('subscription');
  const tc = useTranslations('common');
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const [propertyId, setPropertyId] = useState(properties[0]?.id ?? '');
  const [packageId, setPackageId] = useState<PackageId>('one_br');

  const selectedProperty = properties.find((p) => p.id === propertyId);
  const isRenewal = !!selectedProperty?.has_active_subscription;
  const minStart = isRenewal ? todayPlus(1) : todayPlus(3);
  const [startDate, setStartDate] = useState(minStart);
  const [endDate, setEndDate] = useState(todayPlus(33));

  const selectedPackage = useMemo(() => PACKAGES.find((p) => p.id === packageId), [packageId]);

  const submit = () => {
    setServerError(null);
    startTransition(async () => {
      const res = await createSubscriptionAction({
        property_id: propertyId,
        package_id: packageId,
        start_date: startDate,
        end_date: endDate,
        is_renewal: isRenewal,
      });
      if (!res.success) {
        setServerError(res.message || 'حدث خطأ');
        return;
      }
      router.push(`/${params.locale}/subscriptions`);
      router.refresh();
    });
  };

  return (
    <Stack gap={6}>
      {serverError ? (
        <Box className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {serverError}
        </Box>
      ) : null}

      <Card className="card-premium p-8">
        <Stack gap={5}>
          <Stack gap={2} className="text-right">
            <Label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
              {t('selectProperty')}
            </Label>
            <NativeSelect
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="text-right"
            >
              {properties.length === 0 ? <option value="">—</option> : null}
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.building_name} {p.unit_number ? `· ${p.unit_number}` : ''}
                </option>
              ))}
            </NativeSelect>
          </Stack>

          <Box className="rounded-2xl border border-brand-border bg-brand-offwhite p-4 text-xs font-bold leading-relaxed text-brand-slate">
            {isRenewal ? t('rules.renewalMinDate') : t('rules.newPropertyMinDate')}
          </Box>

          <Grid gap={4} className="md:grid-cols-2">
            <Stack gap={2} className="text-right">
              <Label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
                {t('startDate')}
              </Label>
              <Input
                type="date"
                value={startDate}
                min={minStart}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-right"
              />
            </Stack>
            <Stack gap={2} className="text-right">
              <Label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
                {t('endDate')}
              </Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-right"
              />
            </Stack>
          </Grid>
        </Stack>
      </Card>

      <Stack gap={3}>
        <Typography as="h3" variant="small" className="font-black text-brand-black">
          {t('selectPackage')}
        </Typography>
        <Grid gap={4} className="md:grid-cols-3">
          {PACKAGES.map((pk) => {
            const active = pk.id === packageId;
            return (
              <Button
                key={pk.id}
                type="button"
                variant="outline"
                onClick={() => setPackageId(pk.id)}
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
                  <Typography
                    as="span"
                    variant="h2"
                    className="text-3xl font-black text-brand-black"
                  >
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
      </Stack>

      {selectedPackage ? (
        <Card className="card-premium p-6 text-right">
          <Stack gap={2}>
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
          </Stack>
        </Card>
      ) : null}

      <Button
        type="button"
        onClick={submit}
        disabled={pending || !propertyId}
        rightIcon={<ArrowLeft size={18} />}
        className="w-full rounded-2xl bg-brand-black py-5 text-sm font-black text-white shadow-xl hover:bg-brand-accent disabled:opacity-60"
      >
        {pending ? '...' : t('confirmSubscription')}
      </Button>
    </Stack>
  );
}
