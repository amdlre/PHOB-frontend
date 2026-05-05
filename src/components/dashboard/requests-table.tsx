'use client';

import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import type { DataTableColumnDef } from '@amdlre/design-system';

import { EntityTable } from '@/components/shared/entity-table';
import { RequestStatusBadge } from '@/components/shared/request-status-badge';
import { RowActions } from '@/components/dashboard/row-actions';
import { deleteCleaningRequestAction } from '@/actions/requests';
import { formatDateTime } from '@/lib/utils';
import type { CleaningRequest, RequestStatus } from '@/types/domain';

interface Props {
  requests: CleaningRequest[];
  hrefBase: string;
  /** Show a dedicated client column (operator view). */
  showClient?: boolean;
}

const STATUSES: RequestStatus[] = [
  'pending',
  'scheduled',
  'awaiting_guest_confirmation',
  'in_progress',
  'completed',
  'rejected',
  'cancelled',
];

export function RequestsTable({ requests, hrefBase, showClient = false }: Props) {
  const t = useTranslations('request');
  const ts = useTranslations('request.statuses');
  const tTable = useTranslations('dashboard.dataTable');
  const locale = useLocale();

  const columns = useMemo<DataTableColumnDef<CleaningRequest, unknown>[]>(() => {
    const cols: DataTableColumnDef<CleaningRequest, unknown>[] = [];

    if (showClient) {
      cols.push({
        accessorKey: 'client_name',
        header: t('filters.client'),
        meta: { label: t('filters.client') },
        cell: ({ row }) => (
          <div>
            <span className="block font-bold text-brand-black">
              {row.original.client_name || '—'}
            </span>
            <span className="block text-[11px] font-bold text-brand-slate" dir="ltr">
              {row.original.client_phone}
            </span>
          </div>
        ),
      });
    }

    cols.push({
      accessorKey: 'property_name',
      header: t('selectProperty'),
      meta: { label: t('selectProperty') },
      cell: ({ row }) => (
        <span className="font-bold text-brand-black">
          {row.original.property_name || row.original.property_id}
        </span>
      ),
    });

    cols.push({
      accessorKey: 'scheduled_at',
      header: t('scheduledAt'),
      meta: { label: t('scheduledAt') },
      cell: ({ row }) => (
        <span className="text-xs font-bold text-brand-slate" dir="ltr">
          {formatDateTime(row.original.scheduled_at, locale)}
        </span>
      ),
    });

    cols.push({
      accessorKey: 'cleaning_type',
      header: t('type'),
      meta: { label: t('type') },
      cell: ({ row }) =>
        row.original.cleaning_type
          ? t(`types.${row.original.cleaning_type}` as 'types.regular')
          : '—',
    });

    cols.push({
      accessorKey: 'status',
      header: t('status'),
      meta: { label: t('status') },
      cell: ({ row }) => <RequestStatusBadge status={row.original.status} />,
    });

    cols.push({
      id: 'actions',
      header: tTable('actions'),
      meta: { label: tTable('actions'), excludeFromExport: true },
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <RowActions
          viewHref={`${hrefBase}/${row.original.id}`}
          editHref={`${hrefBase}/${row.original.id}/edit`}
          onDelete={() => deleteCleaningRequestAction(row.original.id)}
          itemLabel={row.original.property_name}
        />
      ),
    });

    return cols;
  }, [t, tTable, locale, showClient, hrefBase]);

  const filterConfigs = useMemo(
    () => [
      {
        key: 'status',
        label: t('status'),
        options: STATUSES.map((s) => ({ value: s, label: ts(s) })),
      },
    ],
    [t, ts],
  );

  return (
    <EntityTable
      data={requests}
      columns={columns}
      getRowId={(row) => row.id}
      searchableKeys={
        showClient
          ? ['client_name', 'client_phone', 'property_name']
          : ['property_name']
      }
      filterConfigs={filterConfigs}
      exportFilename="requests"
    />
  );
}
