'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Container,
  Stack,
  Typography,
} from '@amdlre/design-system';
import { useTranslations } from 'next-intl';

const FAQ_KEYS = [0, 1, 2, 3] as const;

export function FaqSection() {
  const t = useTranslations('landing');

  return (
    <Container as="section" id="faq" size="md" className="py-32">
      <Stack gap={4} align="center" className="mb-16 text-center">
        <Typography
          as="span"
          variant="small"
          className="font-black uppercase tracking-widest text-brand-accent"
        >
          {t('faqEyebrow')}
        </Typography>
        <Typography variant="h1" className="text-balance">
          {t('faqTitle')}
        </Typography>
        <Typography variant="lead">{t('faqLead')}</Typography>
      </Stack>

      <Accordion type="single" collapsible className="w-full">
        {FAQ_KEYS.map((i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="py-6 text-right text-lg font-bold">
              {t(`faq.q${i}` as 'faq.q0')}
            </AccordionTrigger>
            <AccordionContent>
              <Typography variant="p" className="text-brand-slate">
                {t(`faq.a${i}` as 'faq.a0')}
              </Typography>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Container>
  );
}
