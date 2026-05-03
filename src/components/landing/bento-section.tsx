import {
  Box,
  Card,
  CardContent,
  Container,
  Flex,
  Grid,
  Stack,
  Typography,
} from '@amdlre/design-system';
import { Globe, Heart } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function BentoSection() {
  const t = await getTranslations('landing');

  return (
    <Box className="bg-brand-offwhite py-32">
      <Container size="xl">
        <Grid gap={6} className="grid-cols-1 md:grid-cols-3">
          <Card className="relative overflow-hidden rounded-[2.5rem] md:col-span-2">
            <CardContent className="flex min-h-[400px] flex-col justify-between p-12">
              <Box className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-brand-accent/5 blur-3xl" />
              <Stack gap={5} className="relative z-10 max-w-md text-right">
                <Flex align="center" justify="center" className="h-12 w-12 rounded-2xl bg-brand-accent/10 text-brand-accent">
                  <Globe size={22} />
                </Flex>
                <Typography variant="h2">{t('globalTitle')}</Typography>
                <Typography variant="lead">{t('globalBody')}</Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-brand-black bg-brand-black text-white">
            <CardContent className="flex min-h-[400px] flex-col justify-between p-12">
              <Stack gap={5} className="text-right">
                <Flex align="center" justify="center" className="h-12 w-12 rounded-2xl bg-white/10 text-brand-accent">
                  <Heart size={22} />
                </Flex>
                <Typography variant="h3" className="text-white">
                  {t('guestTitle')}
                </Typography>
                <Typography variant="muted" className="leading-relaxed text-white/40">
                  {t('guestBody')}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Container>
    </Box>
  );
}
