'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
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

export function PlansSection() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'ar';
  const { user } = useAuth();
  const ctaHref = user ? `/${locale}${dashboardPathFor(user.role)}` : `/${locale}/login`;

  return (
    <Container as="section" size="xl" className="py-24">
      <Stack gap={6} align="center" className="mb-20 text-center">
        <Typography variant="h1" className="text-balance">
          باقات PHOB الشهرية
        </Typography>
        <Typography variant="lead" className="max-w-2xl">
          اختر الباقة المناسبة لحجم شقتك وتمتع بزيارات{' '}
          <Box as="span" className="font-black text-brand-accent">لا محدودة</Box> طوال شهر الاشتراك، مع تأمين
          كامل لمستلزمات الضيف الفندقية.
        </Typography>
      </Stack>

      <Grid gap={8} className="mb-24 grid-cols-1 md:grid-cols-3">
        {PACKAGES.map((plan) => {
          const featured = plan.id === 'one_br';
          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col rounded-[2.5rem] border p-10 transition-all ${
                featured
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
                  <Box as="span">الأكثر طلباً</Box>
                </Flex>
              )}

              <CardContent className="flex flex-1 flex-col p-0">
                <Stack gap={2} className="mb-10">
                  <Typography as="h3" variant="h3" className="font-black tracking-tight">
                    {plan.name}
                  </Typography>
                  <Typography
                    as="span"
                    variant="small"
                    className={featured ? 'opacity-70' : 'text-brand-slate'}
                  >
                    زيارات لا محدودة طوال الشهر
                  </Typography>
                </Stack>

                <Flex align="baseline" gap={2} className="mb-10">
                  <Typography
                    as="span"
                    variant="h1"
                    className="text-6xl font-black tracking-tighter"
                  >
                    {plan.price}
                  </Typography>
                  <Typography
                    as="span"
                    variant="small"
                    className={featured ? 'opacity-50' : 'text-brand-slate'}
                  >
                    ريال / شهر
                  </Typography>
                </Flex>

                <Stack gap={4} className="mb-10 flex-1">
                  {plan.features.map((feat, idx) => (
                    <Flex key={idx} align="center" gap={3}>
                      <Box
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          featured
                            ? 'bg-brand-accent text-white'
                            : 'bg-brand-accent/10 text-brand-accent'
                        }`}
                      >
                        <Check size={14} strokeWidth={3} />
                      </Box>
                      <Typography as="span" variant="small" className="font-bold">
                        {feat}
                      </Typography>
                    </Flex>
                  ))}
                </Stack>

                <Button asChild size="lg" variant={featured ? 'secondary' : 'default'}>
                  <Link href={ctaHref} className="flex items-center justify-center gap-2">
                    <Box as="span">اشترك الآن</Box>
                    <ArrowLeft size={16} />
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
            هل لديك مساحات أكبر أو وحدات متعددة؟
          </Typography>
          <Typography variant="muted" className="max-w-xl">
            للأحجام الكبيرة (فيلا/أدوار) أو الأعداد الكبيرة من الوحدات، يسعدنا تقديم عرض سعر مخصص لك
            يتوافق مع احتياجاتك.
          </Typography>
          <Button asChild size="lg">
            <a href="mailto:info@phob.sa" className="flex items-center gap-3">
              <Box as="span">تواصل معنا لعروض السعر</Box>
              <Mail size={18} />
            </a>
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
