'use client';

import { useEffect, useState } from 'react';
import { Stack, Typography } from '@amdlre/design-system';

interface CountdownTimerProps {
  targetIso: string;
  /** Show "ready" content once t-60 minutes is reached */
  readyAtMs?: number;
  onReady?: () => void;
  prefix?: string;
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

export function CountdownTimer({
  targetIso,
  readyAtMs = 60 * 60 * 1000,
  onReady,
  prefix,
}: CountdownTimerProps) {
  const target = new Date(targetIso).getTime();
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remainingToTarget = target - now;
  const remainingToReady = remainingToTarget - readyAtMs;
  const isReady = remainingToReady <= 0;

  useEffect(() => {
    if (isReady) onReady?.();
  }, [isReady, onReady]);

  return (
    <Stack gap={2} align="center">
      {prefix ? (
        <Typography
          as="span"
          variant="small"
          className="text-[11px] font-black uppercase tracking-widest text-brand-slate"
        >
          {prefix}
        </Typography>
      ) : null}
      <Typography
        as="span"
        variant="large"
        className="font-mono text-3xl font-black tabular-nums tracking-tight text-brand-black"
        dir="ltr"
      >
        {formatRemaining(remainingToTarget)}
      </Typography>
    </Stack>
  );
}
