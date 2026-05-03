'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
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
import { ArrowLeft, Award, CheckCircle2, Coffee, Sparkles } from 'lucide-react';

const ICONS = [Award, CheckCircle2, Sparkles, Coffee];
const KEYS = [0, 1, 2, 3] as const;

export function ServicesSection() {
  const t = useTranslations('landing');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'ar';

  return (
    <Box className="bg-white py-32">
      <Container size="xl">
        <Grid gap={16} className="grid-cols-1 items-start lg:grid-cols-12">
          <Stack gap={6} className="text-right lg:col-span-5 lg:sticky lg:top-32">
            <Typography
              as="span"
              variant="small"
              className="font-black uppercase tracking-widest text-brand-accent"
            >
              {t('servicesEyebrow')}
            </Typography>
            <Typography variant="h1" className="leading-tight">
              {t('servicesTitle')}
            </Typography>
            <Typography variant="lead">{t('servicesLead')}</Typography>
            <Box className="pt-4">
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href={`/${locale}/register`}>
                  <Typography as="span" variant="small" className="font-black">
                    {t('exploreMore')}
                  </Typography>
                  <ArrowLeft size={18} />
                </Link>
              </Button>
            </Box>
          </Stack>

          <Grid gap={6} className="grid-cols-1 md:grid-cols-2 lg:col-span-7">
            {KEYS.map((i) => {
              const Icon = ICONS[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="group h-full rounded-[2.5rem] transition-all hover:shadow-2xl">
                    <CardContent className="space-y-6 p-10">
                      <Flex
                        align="center"
                        justify="center"
                        className="h-16 w-16 rounded-2xl bg-brand-offwhite text-brand-black shadow-sm transition-all duration-500 group-hover:bg-brand-accent group-hover:text-white"
                      >
                        <Icon size={28} strokeWidth={1.5} />
                      </Flex>
                      <Stack gap={3}>
                        <Typography variant="h3" className="leading-tight">
                          {t(`services.s${i}Title` as 'services.s0Title')}
                        </Typography>
                        <Typography variant="muted" className="leading-relaxed">
                          {t(`services.s${i}Desc` as 'services.s0Desc')}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
