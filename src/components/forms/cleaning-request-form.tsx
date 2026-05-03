'use client';

import { useState, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, AlertCircle } from 'lucide-react';
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
  Textarea,
  Typography,
} from '@amdlre/design-system';
import { createCleaningRequestAction } from '@/actions/requests';
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
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const subscribed = properties.filter((p) => p.has_active_subscription);

  const [propertyId, setPropertyId] = useState(subscribed[0]?.id ?? '');
  const [scheduledAt, setScheduledAt] = useState(defaultScheduledAt());
  const [type, setType] = useState<'regular' | 'deep' | 'checkout'>('checkout');
  const [notes, setNotes] = useState('');

  const submit = () => {
    setError(null);
    if (!propertyId) {
      setError(t('rules.noActiveSub'));
      return;
    }
    startTransition(async () => {
      const res = await createCleaningRequestAction({
        property_id: propertyId,
        scheduled_at: new Date(scheduledAt).toISOString(),
        cleaning_type: type,
        notes,
      });
      if (!res.success) {
        setError(res.message || t('rules.min12h'));
        return;
      }
      router.push(`/${params.locale}/requests`);
      router.refresh();
    });
  };

  return (
    <Stack gap={6}>
      {error ? (
        <Flex
          align="center"
          gap={2}
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600"
        >
          <AlertCircle size={16} />
          <Box as="span">{error}</Box>
        </Flex>
      ) : null}

      {subscribed.length === 0 ? (
        <Box className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
          {t('rules.noActiveSub')}
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
              disabled={subscribed.length === 0}
            >
              {subscribed.length === 0 ? <option value="">—</option> : null}
              {subscribed.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.building_name} {p.unit_number ? `· ${p.unit_number}` : ''}
                </option>
              ))}
            </NativeSelect>
          </Stack>

          <Grid gap={4} className="md:grid-cols-2">
            <Stack gap={2} className="text-right">
              <Label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
                {t('scheduledAt')}
              </Label>
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="text-right"
              />
            </Stack>
            <Stack gap={2} className="text-right">
              <Label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
                {t('type')}
              </Label>
              <NativeSelect
                value={type}
                onChange={(e) => setType(e.target.value as 'regular' | 'deep' | 'checkout')}
                className="text-right"
              >
                <option value="checkout">{t('types.checkout')}</option>
                <option value="regular">{t('types.regular')}</option>
                <option value="deep">{t('types.deep')}</option>
              </NativeSelect>
            </Stack>
          </Grid>

          <Stack gap={2} className="text-right">
            <Label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
              {t('notes')}
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder={t('notesPlaceholder')}
              className="text-right"
            />
          </Stack>
        </Stack>
      </Card>

      <Button
        type="button"
        onClick={submit}
        disabled={pending || subscribed.length === 0}
        rightIcon={<ArrowLeft size={18} />}
        className="w-full rounded-2xl bg-brand-black py-5 text-sm font-black text-white shadow-xl hover:bg-brand-accent disabled:opacity-60"
      >
        {pending ? '...' : t('submit')}
      </Button>
    </Stack>
  );
}
