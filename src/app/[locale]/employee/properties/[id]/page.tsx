import { notFound } from 'next/navigation';
import { Building2, Hash, Layers, MapPin, Pencil, Phone, User } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Box, Button, Flex, Grid, HeaderInfo, Stack, Typography } from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { Property } from '@/types/domain';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EmployeePropertyDetailPage({ params }: Props) {
  const { id, locale } = await params;
  const t = await getTranslations('property');
  const tCommon = await getTranslations('common');

  let property: (Property & { owner_name?: string; owner_phone?: string }) | null = null;
  try {
    const res = await api.get<Property & { owner_name?: string; owner_phone?: string }>(
      ENDPOINTS.properties.detail(id),
    );
    property = res.data;
  } catch {
    notFound();
  }

  const p = property!;
  const mapsUrl = p.lat && p.lng ? `https://www.google.com/maps?q=${p.lat},${p.lng}` : null;

  return (
    <Stack gap={6} className="pb-24">
      <HeaderInfo
        size="md"
        title={p.building_name}
        subtitle={[p.floor_number && `${t('floor')} ${p.floor_number}`, p.unit_number && `${t('unit')} ${p.unit_number}`]
          .filter(Boolean)
          .join(' · ')}
        backHref={`/${locale}/employee/properties`}
        actions={
          <Button
            href={`/${locale}/employee/properties/${p.id}/edit`}
            variant="outline"
            leftIcon={<Pencil size={14} />}
          >
            {tCommon('edit')}
          </Button>
        }
      />

      {p.images?.length > 0 && (
        <Grid gap={3} className="md:grid-cols-3 lg:grid-cols-4">
          {p.images.map((src, i) => (
            <Box
              key={i}
              className="aspect-square overflow-hidden rounded-3xl border border-brand-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={p.building_name} className="h-full w-full object-cover" />
            </Box>
          ))}
        </Grid>
      )}

      {(p.owner_name || p.owner_phone) && (
        <Box className="card-premium p-8">
          <Typography
            as="h2"
            variant="h2"
            className="mb-4 text-sm font-black uppercase tracking-widest text-brand-slate"
          >
            {t('ownerInfo')}
          </Typography>
          <Grid gap={4} className="md:grid-cols-3">
            <Detail icon={<User size={16} />} label="" value={p.owner_name} />
            <Detail icon={<Phone size={16} />} label="" value={p.owner_phone} />
          </Grid>
        </Box>
      )}

      <Box className="card-premium p-8">
        <Grid gap={4} className="md:grid-cols-2">
          <Detail icon={<Building2 size={16} />} label={t('buildingName')} value={p.building_name} />
          <Detail icon={<Layers size={16} />} label={t('floor')} value={p.floor_number} />
          <Detail icon={<Hash size={16} />} label={t('unit')} value={p.unit_number} />
          <Detail icon={<Hash size={16} />} label={t('doorCode')} value={p.door_code} />
          <Detail icon={<MapPin size={16} />} label={t('address')} value={p.address} />
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-black text-brand-accent hover:underline"
            >
              <MapPin size={14} /> {t('location')}
            </a>
          )}
        </Grid>
      </Box>
    </Stack>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label?: string;
  value?: string;
}) {
  return (
    <Stack gap={1}>
      {(icon || label) && (
        <Flex
          align="center"
          gap={2}
          className="text-[10px] font-black uppercase tracking-widest text-brand-slate"
        >
          <>{icon}</>
          {label && <Box as="span">{label}</Box>}
        </Flex>
      )}
      <Typography as="p" variant="small" className="text-sm font-bold text-brand-black">
        {value || '—'}
      </Typography>
    </Stack>
  );
}
