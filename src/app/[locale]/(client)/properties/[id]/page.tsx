import { Building2, Hash, Layers, MapPin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { Property } from '@/types/domain';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations('property');

  let property: Property | null = null;
  try {
    const res = await api.get<Property>(ENDPOINTS.properties.detail(id));
    property = res.data;
  } catch {
    return (
      <div className="card-premium p-12 text-center">
        <p className="text-sm font-bold text-brand-slate">{t('noProperties')}</p>
      </div>
    );
  }

  const p = property!;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24">
      <h1 className="text-3xl font-black tracking-tight text-brand-black">{p.building_name}</h1>

      {p.images?.length > 0 && (
        <div className="grid gap-3 md:grid-cols-3">
          {p.images.map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-3xl border border-brand-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="property" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="card-premium grid gap-4 p-8 sm:grid-cols-2">
        <Detail icon={<Building2 size={16} />} label={t('buildingName')} value={p.building_name} />
        <Detail icon={<Layers size={16} />} label={t('floor')} value={p.floor_number} />
        <Detail icon={<Hash size={16} />} label={t('unit')} value={p.unit_number} />
        <Detail icon={<Hash size={16} />} label={t('doorCode')} value={p.door_code} />
        <Detail icon={<MapPin size={16} />} label={t('address')} value={p.address} />
      </div>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-sm font-bold text-brand-black">{value || '—'}</p>
    </div>
  );
}
