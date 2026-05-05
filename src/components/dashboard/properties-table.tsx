'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
import type { DataTableColumnDef } from '@amdlre/design-system';

import { EntityTable } from '@/components/shared/entity-table';
import { RowActions } from '@/components/dashboard/row-actions';
import { deletePropertyAction } from '@/actions/properties';
import type { Property } from '@/types/domain';

interface Props {
  properties: (Property & { owner_name?: string; owner_phone?: string })[];
  /** Base href for view/edit links, e.g. `/ar/properties` (omit trailing slash). */
  hrefBase: string;
}

export function PropertiesTable({ properties, hrefBase }: Props) {
  const t = useTranslations('property');
  const tTable = useTranslations('dashboard.dataTable');

  const columns = useMemo<
    DataTableColumnDef<Property & { owner_name?: string; owner_phone?: string }, unknown>[]
  >(
    () => [
      {
        accessorKey: 'building_name',
        header: t('buildingName'),
        meta: { label: t('buildingName') },
        cell: ({ row }) => (
          <span className="font-bold text-brand-black">{row.original.building_name}</span>
        ),
      },
      {
        accessorKey: 'floor_number',
        header: t('floor'),
        meta: { label: t('floor') },
        cell: ({ row }) => row.original.floor_number || '—',
      },
      {
        accessorKey: 'unit_number',
        header: t('unit'),
        meta: { label: t('unit') },
        cell: ({ row }) => row.original.unit_number || '—',
      },
      {
        accessorKey: 'door_code',
        header: t('doorCode'),
        meta: { label: t('doorCode') },
        cell: ({ row }) => row.original.door_code || '—',
      },
      {
        accessorKey: 'owner_name',
        header: t('ownerInfo'),
        meta: { label: t('ownerInfo') },
        cell: ({ row }) => {
          const { owner_name, owner_phone } = row.original;
          if (!owner_name && !owner_phone) return '—';
          return (
            <div>
              {owner_name && (
                <span className="block font-bold text-brand-black">{owner_name}</span>
              )}
              {owner_phone && (
                <span className="block text-[11px] font-bold text-brand-slate" dir="ltr">
                  {owner_phone}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: 'has_active_subscription',
        accessorKey: 'has_active_subscription',
        header: t('savedSubscription'),
        meta: { label: t('savedSubscription') },
        cell: ({ row }) => (
          <span
            className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-black ${
              row.original.has_active_subscription
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}
          >
            {row.original.has_active_subscription ? t('savedSubscription') : t('noSubscription')}
          </span>
        ),
      },
      {
        id: 'location',
        header: t('location'),
        meta: { label: t('location'), excludeFromExport: true },
        enableSorting: false,
        cell: ({ row }) => {
          const { lat, lng } = row.original;
          if (!lat || !lng) return '—';
          return (
            <a
              href={`https://www.google.com/maps?q=${lat},${lng}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-black text-brand-accent hover:underline"
            >
              <MapPin size={12} />
              {t('location')}
            </a>
          );
        },
      },
      {
        id: 'actions',
        header: tTable('actions'),
        meta: { label: tTable('actions'), excludeFromExport: true },
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <RowActions
            viewHref={`${hrefBase}/${row.original.id}`}
            editHref={`${hrefBase}/${row.original.id}/edit`}
            onDelete={() => deletePropertyAction(row.original.id)}
            itemLabel={row.original.building_name}
          />
        ),
      },
    ],
    [t, tTable, hrefBase],
  );

  const filterConfigs = useMemo(
    () => [
      {
        key: 'has_active_subscription',
        label: t('savedSubscription'),
        options: [
          { value: 'true', label: t('savedSubscription') },
          { value: 'false', label: t('noSubscription') },
        ],
      },
    ],
    [t],
  );

  return (
    <EntityTable
      data={properties}
      columns={columns}
      getRowId={(row) => row.id}
      searchableKeys={['building_name', 'unit_number', 'owner_name', 'owner_phone']}
      filterConfigs={filterConfigs}
      exportFilename="properties"
    />
  );
}
