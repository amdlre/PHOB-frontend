'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  EntityTable as DSEntityTable,
  type DataTableColumnDef,
  type DataTableFilterConfig,
  type DataTableMessages,
} from '@amdlre/design-system';

import type { ReactNode } from 'react';

interface Props<T extends object> {
  data: T[];
  columns: DataTableColumnDef<T, unknown>[];
  searchableKeys?: Array<keyof T & string>;
  getRowId?: (row: T, index: number) => string;
  enableSearch?: boolean;
  enableExport?: boolean;
  enableColumnToggle?: boolean;
  enableDensityToggle?: boolean;
  enableRowSelection?: boolean;
  filterConfigs?: DataTableFilterConfig[];
  defaultPageSize?: number;
  exportFilename?: string;
  isLoading?: boolean;
  renderSubRow?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
}

export function EntityTable<T extends object>(props: Props<T>) {
  const t = useTranslations('dashboard.dataTable');

  const messages = useMemo<Partial<DataTableMessages>>(
    () => ({
      search: t('search'),
      noResults: t('noResults'),
      columns: t('columns'),
      filters: t('filters'),
      resetFilters: t('resetFilters'),
      rowsSelected: t('rowsSelected'),
      export: t('export'),
      exportCSV: t('exportCSV'),
      exportExcel: t('exportExcel'),
      exportJSON: t('exportJSON'),
      density: t('density'),
      compact: t('compact'),
      default: t('defaultDensity'),
      comfortable: t('comfortable'),
      page: t('page'),
      of: t('of'),
      rowsPerPage: t('rowsPerPage'),
      first: t('first'),
      previous: t('previous'),
      next: t('next'),
      last: t('last'),
      actions: t('actions'),
      edit: t('edit'),
      delete: t('delete'),
      loading: t('loading'),
      sortAsc: t('sortAsc'),
      sortDesc: t('sortDesc'),
      hide: t('hide'),
      pinLeft: t('pinLeft'),
      pinRight: t('pinRight'),
      unpin: t('unpin'),
      clearSearch: t('clearSearch'),
      expandRow: t('expandRow'),
    }),
    [t],
  );

  return <DSEntityTable {...props} messages={messages} />;
}
