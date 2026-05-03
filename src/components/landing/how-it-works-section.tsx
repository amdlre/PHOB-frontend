'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@amdlre/design-system';

const STEPS = [1, 2, 3, 4, 5] as const;

export function HowItWorksSection() {
  const t = useTranslations('landing');

  return (
    <Box className="relative overflow-hidden bg-brand-black py-32 text-white">
      <Box className="pointer-events-none absolute top-0 right-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-accent/10 blur-[120px]" />
      <Container size="xl" className="relative z-10">
        <Stack gap={5} align="center" className="mx-auto mb-24 max-w-3xl text-center">
          <Typography
            as="span"
            variant="small"
            className="font-black uppercase tracking-widest text-brand-accent"
          >
            {t('howEyebrow')}
          </Typography>
          <Typography variant="h1" className="text-white">
            {t('howTitle')}
          </Typography>
          <Typography variant="lead" className="text-white/40">
            {t('howLead')}
          </Typography>
        </Stack>

        <Grid gap={6} className="grid-cols-1 md:grid-cols-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group h-full rounded-3xl border-white/10 bg-white/5 transition-all hover:border-brand-accent/50">
                <CardContent className="p-8">
                  <Typography
                    as="span"
                    variant="h1"
                    className="block text-6xl text-white/5 transition-colors duration-500 group-hover:text-brand-accent/20"
                  >
                    0{step}
                  </Typography>
                  <Stack gap={3} className="mt-8">
                    <Typography variant="h4" className="text-white">
                      {t(`how.step${step}Title` as 'how.step1Title')}
                    </Typography>
                    <Typography variant="small" className="leading-relaxed text-white/40">
                      {t(`how.step${step}Desc` as 'how.step1Desc')}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
