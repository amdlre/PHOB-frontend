'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Button,
  Card,
  CardContent,
  NativeSelect,
  Stack,
  Typography,
} from '@amdlre/design-system';
import { updateRequestStatusAction } from '@/actions/requests';
import type { RequestStatus } from '@/types/domain';

interface Props {
  requestId: string;
  current: RequestStatus;
  guestConfirmed: boolean;
}

const ALL_STATUSES: RequestStatus[] = [
  'pending',
  'scheduled',
  'awaiting_guest_confirmation',
  'in_progress',
  'completed',
  'rejected',
];

export function StatusUpdateControl({ requestId, current, guestConfirmed }: Props) {
  const t = useTranslations('request');
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [next, setNext] = useState<RequestStatus>(current);

  const apply = () => {
    setError(null);
    if (next === 'in_progress' && !guestConfirmed) {
      setError(t('cannotStartWithoutGuestConfirm'));
      return;
    }
    startTransition(async () => {
      const res = await updateRequestStatusAction(requestId, next);
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
        <Stack gap={3}>
          <Typography as="h3" variant="small" className="font-black text-brand-black">
            {t('updateStatus')}
          </Typography>
          <NativeSelect
            value={next}
            onChange={(e) => setNext(e.target.value as RequestStatus)}
            className="text-right"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`statuses.${s}`)}
              </option>
            ))}
          </NativeSelect>
          {error ? (
            <Typography as="p" variant="small" className="text-xs font-bold text-red-500">
              {error}
            </Typography>
          ) : null}
          <Button
            type="button"
            onClick={apply}
            disabled={pending || next === current}
            className="w-full rounded-2xl bg-brand-black py-3 text-xs font-black text-white hover:bg-brand-accent disabled:opacity-60"
          >
            {pending ? '...' : t('updateStatus')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
