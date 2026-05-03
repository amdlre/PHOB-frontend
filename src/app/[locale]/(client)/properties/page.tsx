import Link from 'next/link';
import { Building2, MapPin, Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Box, Flex, Grid, Stack, Typography } from '@amdlre/design-system';
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
    <Stack gap={6} className="pb-24">
      <Flex align="center" justify="between">
        <Typography as="h1" variant="h1" className="text-3xl font-black tracking-tight text-brand-black">
          {t('myProperties')}
        </Typography>
        <Link href={`/${locale}/properties/add`} className="btn-primary">
          <Plus size={16} />
          <Box as="span">{t('addProperty')}</Box>
        </Link>
      </Flex>

      {properties.length === 0 ? (
        <Flex direction="col" align="center" justify="center" gap={4} className="card-premium p-16 text-center">
          <Building2 size={40} className="text-brand-slate" strokeWidth={1.5} />
          <Typography as="p" variant="small" className="text-sm font-bold text-brand-slate">
            {t('noProperties')}
          </Typography>
          <Link href={`/${locale}/properties/add`} className="btn-secondary">
            {t('addFirst')}
          </Link>
        </Flex>
      ) : (
        <Grid gap={6} className="md:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <Link
              key={p.id}
              href={`/${locale}/properties/${p.id}`}
              className="card-premium overflow-hidden transition-transform hover:-translate-y-1"
            >
              <Box className="aspect-[5/3] overflow-hidden bg-brand-offwhite">
                {p.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt={p.building_name} className="h-full w-full object-cover" />
                ) : (
                  <Box className="grid h-full w-full place-items-center text-brand-slate">
                    <Building2 size={32} />
                  </Box>
                )}
              </Box>
              <Stack gap={2} className="p-6">
                <Typography as="h3" variant="h3" className="text-lg font-black text-brand-black">
                  {p.building_name}
                </Typography>
                <Flex align="center" gap={2} className="text-xs font-bold text-brand-slate">
                  <MapPin size={12} />
                  <Box as="span">
                    {[p.floor_number && `${t('floor')} ${p.floor_number}`, p.unit_number && `${t('unit')} ${p.unit_number}`]
                      .filter(Boolean)
                      .join(' · ') || tc('details')}
                  </Box>
                </Flex>
                <Box
                  as="span"
                  className={`mt-2 inline-flex rounded-full border px-2 py-1 text-[10px] font-black ${
                    p.has_active_subscription
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  {p.has_active_subscription ? t('savedSubscription') : t('noSubscription')}
                </Box>
              </Stack>
            </Link>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
