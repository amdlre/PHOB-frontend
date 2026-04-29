'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
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
    <div className="space-y-6">
      {serverError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {serverError}
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
          >
            {properties.length === 0 && <option value="">—</option>}
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.building_name} {p.unit_number ? `· ${p.unit_number}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-brand-border bg-brand-offwhite p-4 text-xs font-bold leading-relaxed text-brand-slate">
          {isRenewal ? t('rules.renewalMinDate') : t('rules.newPropertyMinDate')}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 text-right">
            <label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
              {t('startDate')}
            </label>
            <input
              type="date"
              value={startDate}
              min={minStart}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-base text-right"
            />
          </div>
          <div className="space-y-2 text-right">
            <label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
              {t('endDate')}
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-base text-right"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-black text-brand-black">{t('selectPackage')}</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {PACKAGES.map((pk) => {
            const active = pk.id === packageId;
            return (
              <button
                key={pk.id}
                type="button"
                onClick={() => setPackageId(pk.id)}
                className={`card-premium flex flex-col gap-3 p-6 text-right transition-all ${
                  active ? 'border-brand-accent ring-4 ring-brand-accent/10' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-black text-brand-black">{pk.name}</h4>
                  {active && (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-accent text-white">
                      <Check size={14} />
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 flex-row-reverse">
                  <span className="text-3xl font-black text-brand-black">{pk.price}</span>
                  <span className="text-xs font-bold text-brand-slate">
                    {tc('currency')} {tc('perMonth')}
                  </span>
                </div>
                <ul className="space-y-1 text-xs font-bold text-brand-slate">
                  {pk.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Sparkles size={10} className="text-brand-accent" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </div>

      {selectedPackage && (
        <div className="card-premium space-y-2 p-6 text-right">
          <h4 className="text-xs font-black uppercase tracking-widest text-brand-slate">
            {t('summary')}
          </h4>
          <div className="flex items-center justify-between text-sm font-bold text-brand-black">
            <span>{selectedPackage.name}</span>
            <span>
              {selectedPackage.price} {tc('currency')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm font-bold text-brand-slate">
            <span>{t('startDate')}</span>
            <span dir="ltr">{startDate}</span>
          </div>
          <div className="flex items-center justify-between text-sm font-bold text-brand-slate">
            <span>{t('endDate')}</span>
            <span dir="ltr">{endDate}</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={pending || !propertyId}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-black py-5 text-sm font-black text-white shadow-xl transition-all hover:bg-brand-accent active:scale-95 disabled:opacity-60"
      >
        <span>{pending ? '...' : t('confirmSubscription')}</span>
        <ArrowLeft size={18} />
      </button>
    </div>
  );
}
