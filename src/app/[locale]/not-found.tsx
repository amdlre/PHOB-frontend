import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button, Stack, Typography } from '@amdlre/design-system';

export default function NotFound() {
  const t = useTranslations('common');
  return (
    <Stack
      gap={4}
      align="center"
      className="min-h-[60vh] justify-center px-6 text-center"
    >
      <Typography as="h1" variant="h1" className="text-7xl font-black text-brand-black">
        404
      </Typography>
      <Typography as="p" variant="muted">
        {t('notFound.description')}
      </Typography>
      <Button asChild className="btn-primary">
        <Link href="/">{t('notFound.backHome')}</Link>
      </Button>
    </Stack>
  );
}
