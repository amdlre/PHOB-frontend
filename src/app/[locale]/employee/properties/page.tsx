import { getTranslations } from 'next-intl/server';
import { Building2, Hash, Layers, MapPin, User } from 'lucide-react';
import { Box, Flex, Grid, Stack, Typography } from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { Property } from '@/types/domain';

export default async function EmployeePropertiesPage() {
  const t = await getTranslations('property');

  let properties: (Property & {
    owner_name?: string;
    owner_phone?: string;
  })[] = [];
  try {
    const res = await api.get<Property[]>(ENDPOINTS.properties.list);
    properties = res.data;
  } catch {
    properties = [];
  }

  return (
    <Stack gap={6} className="pb-24">
      <Typography as="h1" variant="h1" className="text-3xl font-black tracking-tight text-brand-black">
        {t('allProperties')}
      </Typography>

      {properties.length === 0 ? (
        <Box className="card-premium p-12 text-center text-sm font-bold text-brand-slate">
          {t('noProperties')}
        </Box>
      ) : (
        <Grid gap={4} className="md:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <Stack key={p.id} gap={3} className="card-premium p-6">
              <Flex align="start" gap={3}>
                <Building2 size={18} className="mt-1 text-brand-accent" />
                <Box className="flex-1">
                  <Typography as="h3" variant="h3" className="text-sm font-black text-brand-black">
                    {p.building_name}
                  </Typography>
                  <Typography as="p" variant="small" className="text-[11px] font-bold text-brand-slate">
                    {[
                      p.floor_number && `${t('floor')} ${p.floor_number}`,
                      p.unit_number && `${t('unit')} ${p.unit_number}`,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </Typography>
                </Box>
              </Flex>

              {p.owner_name && (
                <Flex align="center" gap={2} className="text-xs font-bold text-brand-slate">
                  <User size={12} />
                  <Box as="span">{p.owner_name}</Box>
                  {p.owner_phone && (
                    <Box as="span" dir="ltr" className="text-brand-accent">
                      · {p.owner_phone}
                    </Box>
                  )}
                </Flex>
              )}

              <Flex align="center" gap={2} className="text-xs font-bold text-brand-slate">
                <Hash size={12} />
                <Box as="span">{p.door_code || '—'}</Box>
              </Flex>

              {p.lat && p.lng && (
                <a
                  href={`https://www.google.com/maps?q=${p.lat},${p.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-black text-brand-accent hover:underline"
                >
                  <MapPin size={12} />
                  <Box as="span">{t('location')}</Box>
                </a>
              )}
              <Box className="border-t border-brand-border pt-2">
                <Box
                  as="span"
                  className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-black ${
                    p.has_active_subscription
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  {p.has_active_subscription ? t('savedSubscription') : t('noSubscription')}
                </Box>
              </Box>
              <Layers className="hidden" />
            </Stack>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
