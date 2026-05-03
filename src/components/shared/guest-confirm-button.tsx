'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import { Button, Card, CardContent, Flex, Stack, Typography } from '@amdlre/design-system';
import { CountdownTimer } from './countdown-timer';
import { confirmGuestCheckoutAction } from '@/actions/requests';

interface Props {
  requestId: string;
  scheduledAt: string;
  alreadyConfirmed?: boolean;
}

export function GuestConfirmButton({ requestId, scheduledAt, alreadyConfirmed }: Props) {
  const t = useTranslations('request');
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(() => {
    return Date.now() >= new Date(scheduledAt).getTime() - 60 * 60 * 1000;
  });

  if (alreadyConfirmed) {
    return (
      <Flex
        align="center"
        gap={2}
        className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
      >
        <CheckCircle2 size={16} />
        <Typography as="span" variant="small">
          {t('guestConfirmedAt')}
        </Typography>
      </Flex>
    );
  }

  const click = () => {
    setError(null);
    startTransition(async () => {
      const res = await confirmGuestCheckoutAction(requestId);
      if (!res.success) {
        setError(res.message || 'حدث خطأ');
        return;
      }
      router.refresh();
    });
  };

  return (
    <Card className="card-premium">
      <CardContent className="p-6">
        <Stack gap={4} align="center">
          <CountdownTimer
            targetIso={scheduledAt}
            prefix={t('countdownPrefix')}
            onReady={() => setEnabled(true)}
          />
          {!enabled ? (
            <Typography as="p" variant="small" className="text-xs font-bold text-brand-slate">
              {t('guestConfirmHint')}
            </Typography>
          ) : null}
          {error ? (
            <Typography as="p" variant="small" className="text-xs font-bold text-red-500">
              {error}
            </Typography>
          ) : null}
          <Button
            type="button"
            onClick={click}
            disabled={!enabled || pending}
            leftIcon={<CheckCircle2 size={16} />}
            className="rounded-2xl bg-brand-accent px-6 py-3 text-sm font-black text-white shadow-lg hover:bg-brand-black disabled:opacity-50"
          >
            {pending ? '...' : t('guestConfirm')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
