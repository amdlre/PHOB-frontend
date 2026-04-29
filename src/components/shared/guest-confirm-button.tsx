'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
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
      <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
        <CheckCircle2 size={16} />
        <span>{t('guestConfirmedAt')}</span>
      </div>
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
    <div className="card-premium flex flex-col items-center gap-4 p-6">
      <CountdownTimer
        targetIso={scheduledAt}
        prefix={t('countdownPrefix')}
        onReady={() => setEnabled(true)}
      />
      {!enabled && <p className="text-xs font-bold text-brand-slate">{t('guestConfirmHint')}</p>}
      {error && <p className="text-xs font-bold text-red-500">{error}</p>}
      <button
        type="button"
        onClick={click}
        disabled={!enabled || pending}
        className="flex items-center gap-2 rounded-2xl bg-brand-accent px-6 py-3 text-sm font-black text-white shadow-lg transition-all hover:bg-brand-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CheckCircle2 size={16} />
        <span>{pending ? '...' : t('guestConfirm')}</span>
      </button>
    </div>
  );
}
