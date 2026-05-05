'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Box,
  SimpleTable,
  Stack,
  Typography,
  type SimpleTableColumn,
} from '@amdlre/design-system';
import { RequestStatusBadge } from '@/components/shared/request-status-badge';
import { RowActions } from '@/components/dashboard/row-actions';
import { deleteCleaningRequestAction } from '@/actions/requests';
import { formatDateTime } from '@/lib/utils';
import type { CleaningRequest } from '@/types/domain';

interface Props {
  requests: CleaningRequest[];
  hrefBase: string;
  /** Show a dedicated client column (operator view). */
  showClient?: boolean;
  /** Hide the per-row actions column (e.g. read-only widgets on dashboards). */
  hideActions?: boolean;
}

/**
 * Lightweight, read-friendly orders/requests list. Backed by the design
 * system's `SimpleTable` so the markup stays declarative — no toolbar,
 * filters, or pagination, just `columns` + `data`.
 */
export function OrdersList({
  requests,
  hrefBase,
  showClient = false,
  hideActions = false,
}: Props) {
  const t = useTranslations('request');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const columns = useMemo<SimpleTableColumn<CleaningRequest>[]>(() => {
    const cols: SimpleTableColumn<CleaningRequest>[] = [];

    if (showClient) {
      cols.push({
        id: 'client',
        header: t('filters.client'),
        cell: (r) => (
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
        ),
      });
    }

    cols.push({
      id: 'property',
      header: t('selectProperty'),
      cell: (r) => (
        <Link
          href={`${hrefBase}/${r.id}`}
          className="text-sm font-bold text-brand-black hover:text-brand-accent"
        >
          {r.property_name || r.property_id}
        </Link>
      ),
    });

    cols.push({
      id: 'scheduled',
      header: t('scheduledAt'),
      cell: (r) => (
        <span className="text-xs font-bold text-brand-slate" dir="ltr">
          {formatDateTime(r.scheduled_at, locale)}
        </span>
      ),
    });

    cols.push({
      id: 'type',
      header: t('type'),
      cell: (r) =>
        r.cleaning_type ? (
          <span className="text-xs font-bold text-brand-black">
            {t(`types.${r.cleaning_type}` as 'types.regular')}
          </span>
        ) : (
          '—'
        ),
    });

    cols.push({
      id: 'status',
      header: t('status'),
      align: 'end',
      cell: (r) => <RequestStatusBadge status={r.status} />,
    });

    if (!hideActions) {
      cols.push({
        id: 'actions',
        header: tCommon('actions'),
        align: 'end',
        cell: (r) => (
          <RowActions
            viewHref={`${hrefBase}/${r.id}`}
            editHref={`${hrefBase}/${r.id}/edit`}
            onDelete={() => deleteCleaningRequestAction(r.id)}
            itemLabel={r.property_name}
          />
        ),
      });
    }

    return cols;
  }, [t, tCommon, locale, hrefBase, showClient, hideActions]);

  return (
    <SimpleTable<CleaningRequest>
      data={requests}
      columns={columns}
      getRowId={(r) => r.id}
      className="card-premium"
      emptyState={
        <Box className="card-premium p-12 text-center text-sm font-bold text-brand-slate">
          {t('noRequests')}
        </Box>
      }
    />
  );
}
