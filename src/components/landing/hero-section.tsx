'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  AspectRatio,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Flex,
  Grid,
  Separator,
  Stack,
  Typography,
} from '@amdlre/design-system';
import { ArrowLeft, Clock, ShieldCheck, Star } from 'lucide-react';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=2000';

const AVATARS = [
  'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?auto=format&fit=crop&q=80&w=100&h=100',
  'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?auto=format&fit=crop&q=80&w=100&h=100',
  'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=100&h=100',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=100&h=100',
];

export function HeroSection() {
  const t = useTranslations('landing');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'ar';

  return (
    <Container as="section" size="xl" className="relative pt-24 pb-32">
      <Grid gap={16} className="grid-cols-1 items-center lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Stack gap={8} className="text-right">
            <Badge
              variant="outline"
              className="w-fit gap-2 border-brand-accent/30 bg-brand-accent/5 text-brand-accent"
            >
              <Star size={12} />
              <Typography as="span" variant="small" className="font-black">
                {t('heroBadge')}
              </Typography>
            </Badge>

            <Typography
              variant="h1"
              className="text-6xl leading-[1.1] tracking-tight text-balance lg:text-[112px]"
            >
              {t('heroTitle1')}{' '}
              <Typography
                as="span"
                variant="h1"
                className="font-serif font-light italic text-brand-accent"
              >
                {t('heroTitle2')}
              </Typography>
              <br />
              {t('heroTitle3')}
            </Typography>

            <Typography variant="lead" className="max-w-xl">
              {t('heroSubtitle')}
            </Typography>

            <Flex wrap="wrap" gap={6} className="pt-4">
              <Button
                rightIcon={<ArrowLeft size={16} />}
                href={`/register`}
                locale={locale}
                size={"2xl"}
                rounded={"xl"}
              >
                {t('ctaStart')}
              </Button>


              <Card className="rounded-2xl">
                <CardContent className="p-0">
                  <Flex align="center" gap={4} className="px-6 py-3">
                    <Flex className="-space-x-2 flex-row-reverse">
                      {AVATARS.map((src, i) => (
                        <Avatar key={i} className="h-8 w-8 border-2 border-white">
                          <AvatarImage src={src} alt="host" />
                          <AvatarFallback>H</AvatarFallback>
                        </Avatar>
                      ))}
                    </Flex>
                    <Separator orientation="vertical" className="h-8" />
                    <Flex align="center" gap={2}>
                      <Star size={14} className="fill-brand-accent text-brand-accent" />
                      <Stack gap={0}>
                        <Typography as="span" variant="small" className="font-black leading-none">
                          {t('ratingLabel')}
                        </Typography>
                        <Typography
                          as="span"
                          variant="small"
                          className="text-[10px] font-black uppercase tracking-widest text-brand-slate"
                        >
                          {t('rating')}
                        </Typography>
                      </Stack>
                    </Flex>
                  </Flex>
                </CardContent>
              </Card>
            </Flex>
          </Stack>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <Card className="overflow-hidden rounded-[4rem] border-[12px] border-white shadow-2xl">
            <CardContent className="p-0">
              <AspectRatio ratio={4 / 5}>
                <Image
                  src={HERO_IMAGE}
                  alt="Luxury Interior"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
              </AspectRatio>
            </CardContent>
          </Card>

          <motion.div
            className="absolute -bottom-10 -right-10 z-20 hidden max-w-[280px] md:block"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Card className="rounded-[2.5rem] shadow-2xl">
              <CardContent className="p-8">
                <Stack gap={3} className="text-right">
                  <Flex
                    align="center"
                    justify="center"
                    className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-500"
                  >
                    <ShieldCheck size={24} />
                  </Flex>
                  <Typography variant="h4">{t('qualityBadge')}</Typography>
                  <Typography variant="muted" className="leading-relaxed">
                    {t('qualityBody')}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="absolute top-20 -left-12 z-20 hidden max-w-[240px] md:block"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <Card className="rounded-[2.5rem] border-brand-black bg-brand-black text-white shadow-2xl">
              <CardContent className="p-8">
                <Stack gap={3} className="text-right">
                  <Flex
                    align="center"
                    justify="center"
                    className="h-10 w-10 rounded-xl bg-brand-accent text-white"
                  >
                    <Clock size={20} />
                  </Flex>
                  <Typography variant="h4" className="text-white">
                    {t('punctualBadge')}
                  </Typography>
                  <Typography variant="muted" className="leading-relaxed text-white/40">
                    {t('punctualBody')}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>

          <Box />
        </motion.div>
      </Grid>
    </Container>
  );
}
