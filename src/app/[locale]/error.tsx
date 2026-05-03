'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Stack, Typography } from '@amdlre/design-system';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Stack
      gap={4}
      align="center"
      className="min-h-[60vh] justify-center px-6 text-center"
    >
      <Typography as="h2" variant="h2" className="font-black text-brand-black">
        {t('error.title')}
      </Typography>
      <Typography as="p" variant="muted">
        {t('error.description')}
      </Typography>
      <Button onClick={reset} className="btn-primary">
        {t('error.retry')}
      </Button>
    </Stack>
  );
}
