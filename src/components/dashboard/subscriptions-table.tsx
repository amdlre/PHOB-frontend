'use client';

import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import type { DataTableColumnDef } from '@amdlre/design-system';

import { EntityTable } from '@/components/shared/entity-table';
import { formatDate } from '@/lib/utils';
import type { Subscription, SubscriptionStatus } from '@/types/domain';

interface Props {
  subscriptions: Subscription[];
}

const STATUSES: SubscriptionStatus[] = ['active', 'pending', 'expired', 'cancelled'];

const STATUS_STYLES: Record<SubscriptionStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  expired: 'bg-slate-100 text-slate-700 border-slate-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export function SubscriptionsTable({ subscriptions }: Props) {
  const t = useTranslations('subscription');
  const ts = useTranslations('subscription.statuses');
  const locale = useLocale();

  const columns = useMemo<DataTableColumnDef<Subscription, unknown>[]>(
    () => [
      {
        accessorKey: 'property_name',
        header: t('selectProperty'),
        meta: { label: t('selectProperty') },
        cell: ({ row }) => (
          <span className="font-bold text-brand-black">
            {row.original.property_name || row.original.property_id}
          </span>
        ),
      },
      {
        accessorKey: 'package_name',
        header: t('package'),
        meta: { label: t('package') },
        cell: ({ row }) => (
          <span className="font-bold text-brand-black">
            {row.original.package_name || row.original.package_id}
          </span>
        ),
      },
      {
        accessorKey: 'start_date',
        header: t('startDate'),
        meta: { label: t('startDate') },
        cell: ({ row }) => (
          <span className="font-bold text-brand-black">{formatDate(row.original.start_date, locale)}</span>
        ),
      },
      {
        accessorKey: 'end_date',
        header: t('endDate'),
        meta: { label: t('endDate') },
        cell: ({ row }) => (
          <span className="font-bold text-brand-black">{formatDate(row.original.end_date, locale)}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: t('status'),
        meta: { label: t('status') },
        cell: ({ row }) => (
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
              STATUS_STYLES[row.original.status] ?? STATUS_STYLES.pending
            }`}
          >
            {ts(row.original.status)}
          </span>
        ),
      },
    ],
    [t, ts, locale],
  );

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
      data={subscriptions}
      columns={columns}
      getRowId={(row) => row.id}
      searchableKeys={['property_name', 'package_name']}
      filterConfigs={filterConfigs}
      exportFilename="subscriptions"
    />
  );
}
