'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from '@amdlre/design-system';
import { RequestStatusBadge } from '@/components/shared/request-status-badge';
import { formatDateTime } from '@/lib/utils';
import type { CleaningRequest } from '@/types/domain';

interface Props {
  requests: CleaningRequest[];
  hrefBase: string;
  /** Show a dedicated client column (operator view). */
  showClient?: boolean;
}

/**
 * Lightweight, read-friendly orders/requests table. Built on the DS `Table`
 * primitives with no toolbar / filters / pagination — for places where the
 * heavy EntityTable would be overkill.
 */
export function OrdersList({ requests, hrefBase, showClient = false }: Props) {
  const t = useTranslations('request');
  const locale = useLocale();

  if (requests.length === 0) {
    return (
      <Box className="card-premium p-12 text-center text-sm font-bold text-brand-slate">
        {t('noRequests')}
      </Box>
    );
  }

  return (
    <Box className="card-premium overflow-hidden">
      <Table className="w-full">
        <TableHeader className="bg-brand-offwhite">
          <TableRow className="border-b border-brand-border">
            {showClient && (
              <TableHead className="px-6 py-3 text-start text-[10px] font-black uppercase tracking-widest text-brand-slate">
                {t('filters.client')}
              </TableHead>
            )}
            <TableHead className="px-6 py-3 text-start text-[10px] font-black uppercase tracking-widest text-brand-slate">
              {t('selectProperty')}
            </TableHead>
            <TableHead className="px-6 py-3 text-start text-[10px] font-black uppercase tracking-widest text-brand-slate">
              {t('scheduledAt')}
            </TableHead>
            <TableHead className="px-6 py-3 text-start text-[10px] font-black uppercase tracking-widest text-brand-slate">
              {t('type')}
            </TableHead>
            <TableHead className="px-6 py-3 text-end text-[10px] font-black uppercase tracking-widest text-brand-slate">
              {t('status')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((r) => (
            <TableRow
              key={r.id}
              className="border-b border-brand-border/60 transition-colors last:border-0 hover:bg-brand-offwhite/60"
            >
              {showClient && (
                <TableCell className="px-6 py-4">
                  <Stack gap={0}>
                    <Typography as="span" variant="small" className="font-black text-brand-black">
                      {r.client_name || '—'}
                    </Typography>
                    {r.client_phone && (
                      <Typography
                        as="span"
                        variant="small"
                        className="text-[11px] font-bold text-brand-slate"
                        dir="ltr"
                      >
                        {r.client_phone}
                      </Typography>
                    )}
                  </Stack>
                </TableCell>
              )}
              <TableCell className="px-6 py-4">
                <Link
                  href={`${hrefBase}/${r.id}`}
                  className="text-sm font-bold text-brand-black hover:text-brand-accent"
                >
                  {r.property_name || r.property_id}
                </Link>
              </TableCell>
              <TableCell className="px-6 py-4 text-xs font-bold text-brand-slate" dir="ltr">
                {formatDateTime(r.scheduled_at, locale)}
              </TableCell>
              <TableCell className="px-6 py-4 text-xs font-bold text-brand-black">
                {r.cleaning_type
                  ? t(`types.${r.cleaning_type}` as 'types.regular')
                  : '—'}
              </TableCell>
              <TableCell className="px-6 py-4 text-end">
                <RequestStatusBadge status={r.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
