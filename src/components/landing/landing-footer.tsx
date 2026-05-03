import { Container, Flex, Grid, Separator, Stack, Typography } from '@amdlre/design-system';
import { Globe, Mail, MessageCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Logo } from '@/components/shared/logo';

export async function LandingFooter() {
  const t = await getTranslations('footer');

  return (
    <Flex as="footer" justify="center" className="border-t border-brand-border bg-white py-24">
      <Container size="xl" className="w-full">
        <Grid gap={12} className="grid-cols-1 md:grid-cols-3">
          <Stack gap={4}>
            <Logo size="md" className="text-brand-black" />
            <Typography variant="muted" className="max-w-xs leading-relaxed">
              {t('description')}
            </Typography>
          </Stack>

          <Grid gap={6} className="grid-cols-2">
            <Stack gap={3}>
              <Typography
                as="span"
                variant="small"
                className="font-black uppercase tracking-[0.2em] text-brand-black"
              >
                {t('platform')}
              </Typography>
              <Typography variant="muted">PHOB</Typography>
            </Stack>
            <Stack gap={3}>
              <Typography
                as="span"
                variant="small"
                className="font-black uppercase tracking-[0.2em] text-brand-black"
              >
                {t('contact')}
              </Typography>
              <Typography variant="muted">info@phob.sa</Typography>
              <Typography variant="muted">9200XXXXX</Typography>
            </Stack>
          </Grid>

          <Stack gap={4}>
            <Typography
              as="span"
              variant="small"
              className="font-black uppercase tracking-[0.2em] text-brand-black"
            >
              {t('follow')}
            </Typography>
            <Flex gap={3}>
              {[MessageCircle, Mail, Globe].map((Icon, i) => (
                <Flex
                  as="a"
                  key={i}
                  align="center"
                  justify="center"
                  className="h-10 w-10 rounded-2xl bg-brand-offwhite text-brand-black transition-all hover:bg-brand-accent hover:text-white"
                >
                  <Icon size={18} />
                </Flex>
              ))}
            </Flex>
          </Stack>
        </Grid>

        <Separator className="my-12" />

        <Flex justify="between" align="center" wrap="wrap" gap={4} className="flex-col md:flex-row">
          <Typography
            as="span"
            variant="small"
            className="font-bold uppercase tracking-[0.1em] text-brand-slate"
          >
            © {new Date().getFullYear()} PHOB · {t('rights')}
          </Typography>
          <Flex gap={6}>
            <Typography
              as="span"
              variant="small"
              className="font-bold uppercase tracking-wider text-brand-slate"
            >
              {t('privacy')}
            </Typography>
            <Typography
              as="span"
              variant="small"
              className="font-bold uppercase tracking-wider text-brand-slate"
            >
              {t('terms')}
            </Typography>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
}
