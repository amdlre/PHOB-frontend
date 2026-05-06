'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Flex,
  Stack,
  Typography,
} from '@amdlre/design-system';
import { ArrowLeft } from 'lucide-react';

export function CtaFinalSection() {
  const t = useTranslations('landing');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'ar';

  return (
    <Box className="relative overflow-hidden bg-brand-black py-32 text-white">
      <Box className="pointer-events-none absolute inset-0 opacity-20">
        <Box className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#6366F1_0%,transparent_50%)] blur-[120px]" />
      </Box>
      <Container size="xl" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Stack gap={12} align="center" className="text-center">
            <Stack gap={6} align="center">
              <Typography
                variant="h1"
                className="text-5xl leading-[1.1] tracking-tight text-balance text-white md:text-7xl"
              >
                {t('ctaFinalTitle1')} <br />
                <Typography
                  as="span"
                  variant="h1"
                  className="font-serif font-light italic text-brand-accent"
                >
                  {t('ctaFinalTitle2')}
                </Typography>
              </Typography>
              <Typography variant="lead" className="mx-auto max-w-2xl text-white/40">
                {t('ctaFinalLead')}
              </Typography>
            </Stack>
            <Flex justify="center" gap={6}>
              <Button
                locale={locale}
                href='/register'
                rightIcon={<ArrowLeft size={18} className='ltr:rotate-180' />}
                size={"xl"}
                rounded={"xl"}
                variant={"secondary"}
              >
                {t('ctaStart')}
              </Button>
            </Flex>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
