'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Check, Mail, Sparkles } from 'lucide-react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Flex,
  Grid,
  Stack,
  Typography,
} from '@amdlre/design-system';
import { PACKAGES } from '@/constants/packages';
import { useAuth } from '@/providers/auth-provider';
import { dashboardPathFor } from '@/lib/auth/paths';

const FEATURE_KEYS = ['f0', 'f1', 'f2', 'f3'] as const;

export function PlansSection() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'ar';
  const t = useTranslations('landing.plans');
  const { user } = useAuth();
  const ctaHref = user ? `/${locale}${dashboardPathFor(user.role)}` : `/${locale}/login`;

  return (
    <Container as="section" size="xl" className="py-24">
      <Stack gap={6} align="center" className="mb-20 text-center">
        <Typography variant="h1" className="text-balance">
          {t('title')}
        </Typography>
        <Typography variant="lead" className="max-w-2xl">
          {t('leadBefore')}{' '}
          <Box as="span" className="font-black text-brand-accent">
            {t('leadHighlight')}
          </Box>{' '}
          {t('leadAfter')}
        </Typography>
      </Stack>

      <Grid gap={8} className="mb-24 grid-cols-1 md:grid-cols-3">
        {PACKAGES.map((plan) => {
          const featured = plan.id === 'one_br';
          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col rounded-[2.5rem] border p-10 transition-all ${featured
                ? 'z-10 scale-105 border-brand-black bg-brand-black text-white shadow-xl'
                : 'border-brand-border bg-white hover:border-brand-accent hover:shadow-xl'
                }`}
            >
              {featured && (
                <Flex
                  align="center"
                  gap={2}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-brand-accent px-5 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
                >
                  <Sparkles size={12} />
                  <Box as="span">{t('mostPopular')}</Box>
                </Flex>
              )}

              <CardContent className="flex flex-1 flex-col p-0">
                <Stack gap={2} className="mb-10">
                  <Typography
                    as="h3"
                    variant="h3"
                    className={`font-black tracking-tight ${featured ? 'text-white' : ''}`}
                  >
                    {t(`packages.${plan.id}` as 'packages.studio')}
                  </Typography>
                  <Typography
                    as="span"
                    variant="small"
                    className={featured ? 'text-white/70' : 'text-brand-slate'}
                  >
                    {t('unlimitedTagline')}
                  </Typography>
                </Stack>

                <Flex align="baseline" gap={2} className="mb-10">
                  <Typography
                    as="span"
                    variant="h1"
                    className={`text-6xl font-black tracking-tighter ${featured ? 'text-white' : ''}`}
                  >
                    {plan.price}
                  </Typography>
                  <Typography
                    as="span"
                    variant="small"
                    className={featured ? 'text-white/60' : 'text-brand-slate'}
                  >
                    {t('currency')} {t('perMonth')}
                  </Typography>
                </Flex>

                <Stack gap={4} className="mb-10 flex-1">
                  {FEATURE_KEYS.map((key) => (
                    <Flex key={key} align="center" gap={3}>
                      <Box
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${featured
                          ? 'bg-brand-accent text-white'
                          : 'bg-brand-accent/10 text-brand-accent'
                          }`}
                      >
                        <Check size={14} strokeWidth={3} />
                      </Box>
                      <Typography
                        as="span"
                        variant="small"
                        className={`font-bold ${featured ? 'text-white' : ''}`}
                      >
                        {t(`features.${key}` as 'features.f0')}
                      </Typography>
                    </Flex>
                  ))}
                </Stack>

                <Button asChild size="lg" variant={featured ? 'secondary' : 'default'}>
                  <Link href={ctaHref} className="flex items-center justify-center gap-2">
                    <Box as="span">{t('subscribeNow')}</Box>
                    <ArrowLeft size={16} className='ltr:rotate-180' />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Grid>

      <Box className="rounded-[2.5rem] border border-dashed border-brand-accent/30 bg-brand-accent/5 p-12 text-center">
        <Stack gap={4} align="center">
          <Typography as="h3" variant="h3" className="font-black">
            {t('enterpriseTitle')}
          </Typography>
          <Typography variant="muted" className="max-w-xl">
            {t('enterpriseLead')}
          </Typography>
          <Button asChild size="lg">
            <a href="mailto:info@phob.sa" className="flex items-center gap-3">
              <Box as="span">{t('enterpriseCta')}</Box>
              <Mail size={18} />
            </a>
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
