import Link from 'next/link';
import { Building2, MapPin, Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { Property } from '@/types/domain';
import type { PageProps } from '@/types';

export default async function ClientPropertiesPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('property');
  const tc = await getTranslations('common');

  let properties: Property[] = [];
  try {
    const res = await api.get<Property[]>(ENDPOINTS.properties.list);
    properties = res.data;
  } catch {
    properties = [];
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight text-brand-black">{t('myProperties')}</h1>
        <Link href={`/${locale}/properties/add`} className="btn-primary">
          <Plus size={16} />
          <span>{t('addProperty')}</span>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="card-premium flex flex-col items-center justify-center gap-4 p-16 text-center">
          <Building2 size={40} className="text-brand-slate" strokeWidth={1.5} />
          <p className="text-sm font-bold text-brand-slate">{t('noProperties')}</p>
          <Link href={`/${locale}/properties/add`} className="btn-secondary">
            {t('addFirst')}
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <Link
              key={p.id}
              href={`/${locale}/properties/${p.id}`}
              className="card-premium overflow-hidden transition-transform hover:-translate-y-1"
            >
              <div className="aspect-[5/3] overflow-hidden bg-brand-offwhite">
                {p.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt={p.building_name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-brand-slate">
                    <Building2 size={32} />
                  </div>
                )}
              </div>
              <div className="space-y-2 p-6">
                <h3 className="text-lg font-black text-brand-black">{p.building_name}</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-brand-slate">
                  <MapPin size={12} />
                  <span>
                    {[p.floor_number && `${t('floor')} ${p.floor_number}`, p.unit_number && `${t('unit')} ${p.unit_number}`]
                      .filter(Boolean)
                      .join(' · ') || tc('details')}
                  </span>
                </div>
                <span
                  className={`mt-2 inline-flex rounded-full border px-2 py-1 text-[10px] font-black ${
                    p.has_active_subscription
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  {p.has_active_subscription ? t('savedSubscription') : t('noSubscription')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
