import { Building2, Hash, Layers, MapPin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Box, Flex, Grid, HeaderInfo, Stack, Typography } from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { Property } from '@/types/domain';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id, locale } = await params;
  const t = await getTranslations('property');

  let property: Property | null = null;
  try {
    const res = await api.get<Property>(ENDPOINTS.properties.detail(id));
    property = res.data;
  } catch {
    return (
      <Box className="card-premium p-12 text-center">
        <Typography as="p" variant="small" className="text-sm font-bold text-brand-slate">
          {t('noProperties')}
        </Typography>
      </Box>
    );
  }

  const p = property!;

  return (
    <Stack gap={6} className="pb-24">
      <HeaderInfo
        size="md"
        title={p.building_name}
        subtitle={[p.floor_number && `${t('floor')} ${p.floor_number}`, p.unit_number && `${t('unit')} ${p.unit_number}`]
          .filter(Boolean)
          .join(' · ')}
        backHref={`/${locale}/properties`}
      />

      {p.images?.length > 0 && (
        <Grid gap={3} className="md:grid-cols-3">
          {p.images.map((src, i) => (
            <Box key={i} className="aspect-square overflow-hidden rounded-3xl border border-brand-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="property" className="h-full w-full object-cover" />
            </Box>
          ))}
        </Grid>
      )}

      <Grid gap={4} className="card-premium p-8 sm:grid-cols-2">
        <Detail icon={<Building2 size={16} />} label={t('buildingName')} value={p.building_name} />
        <Detail icon={<Layers size={16} />} label={t('floor')} value={p.floor_number} />
        <Detail icon={<Hash size={16} />} label={t('unit')} value={p.unit_number} />
        <Detail icon={<Hash size={16} />} label={t('doorCode')} value={p.door_code} />
        <Detail icon={<MapPin size={16} />} label={t('address')} value={p.address} />
      </Grid>
    </Stack>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <Stack gap={1}>
      <Flex align="center" gap={2} className="text-[10px] font-black uppercase tracking-widest text-brand-slate">
        <>{icon}</>
        <Box as="span">{label}</Box>
      </Flex>
      <Typography as="p" variant="small" className="text-sm font-bold text-brand-black">
        {value || '—'}
      </Typography>
    </Stack>
  );
}
