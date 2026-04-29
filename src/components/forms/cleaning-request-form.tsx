'use client';

import { useState, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { createCleaningRequestAction } from '@/actions/requests';
import type { Property } from '@/types/domain';

interface Props {
  properties: Property[];
}

function defaultScheduledAt(): string {
  // 12 hours + 1 hour buffer rounded to next hour
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
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {subscribed.length === 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
          {t('rules.noActiveSub')}
        </div>
      )}

      <div className="card-premium space-y-5 p-8">
        <div className="space-y-2 text-right">
          <label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
            {t('selectProperty')}
          </label>
          <select
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            className="input-base text-right"
            disabled={subscribed.length === 0}
          >
            {subscribed.length === 0 && <option value="">—</option>}
            {subscribed.map((p) => (
              <option key={p.id} value={p.id}>
                {p.building_name} {p.unit_number ? `· ${p.unit_number}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 text-right">
            <label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
              {t('scheduledAt')}
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="input-base text-right"
            />
          </div>
          <div className="space-y-2 text-right">
            <label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
              {t('type')}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'regular' | 'deep' | 'checkout')}
              className="input-base text-right"
            >
              <option value="checkout">{t('types.checkout')}</option>
              <option value="regular">{t('types.regular')}</option>
              <option value="deep">{t('types.deep')}</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 text-right">
          <label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
            {t('notes')}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder={t('notesPlaceholder')}
            className="input-base text-right"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={pending || subscribed.length === 0}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-black py-5 text-sm font-black text-white shadow-xl transition-all hover:bg-brand-accent active:scale-95 disabled:opacity-60"
      >
        <span>{pending ? '...' : t('submit')}</span>
        <ArrowLeft size={18} />
      </button>
    </div>
  );
}
