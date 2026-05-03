import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import {
  Box,
  Flex,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { formatDate } from '@/lib/utils';
import type { Subscription } from '@/types/domain';
import type { PageProps } from '@/types';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  expired: 'bg-slate-100 text-slate-700 border-slate-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default async function ClientSubscriptionsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('subscription');

  let subs: Subscription[] = [];
  try {
    const res = await api.get<Subscription[]>(ENDPOINTS.subscriptions.list);
    subs = res.data;
  } catch {
    subs = [];
  }

  return (
    <Stack gap={6} className="pb-24">
      <Flex align="center" justify="between">
        <Typography as="h1" variant="h1" className="text-3xl font-black tracking-tight text-brand-black">
          {t('title')}
        </Typography>
        <Link href={`/${locale}/subscriptions/new`} className="btn-primary">
          <Plus size={16} />
          <Box as="span">{t('newSubscription')}</Box>
        </Link>
      </Flex>

      {subs.length === 0 ? (
        <Flex direction="col" align="center" gap={4} className="card-premium p-16 text-center">
          <Sparkles size={40} className="text-brand-slate" strokeWidth={1.5} />
          <Typography as="p" variant="small" className="text-sm font-bold text-brand-slate">
            {t('noSubscriptions')}
          </Typography>
        </Flex>
      ) : (
        <Box className="card-premium overflow-hidden">
          <Table className="w-full">
            <TableHeader className="bg-brand-offwhite text-right">
              <TableRow>
                <TableHead className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-brand-slate">
                  {t('selectProperty')}
                </TableHead>
                <TableHead className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-brand-slate">
                  {t('package')}
                </TableHead>
                <TableHead className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-brand-slate">
                  {t('startDate')}
                </TableHead>
                <TableHead className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-brand-slate">
                  {t('endDate')}
                </TableHead>
                <TableHead className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-brand-slate">
                  {t('status')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subs.map((s) => (
                <TableRow key={s.id} className="border-t border-brand-border text-right text-sm">
                  <TableCell className="px-6 py-4 font-bold text-brand-black">
                    {s.property_name || s.property_id}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-brand-black">
                    {s.package_name || s.package_id}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-brand-black">
                    {formatDate(s.start_date, locale)}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-brand-black">
                    {formatDate(s.end_date, locale)}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-brand-black">
                    <Box
                      as="span"
                      className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${STATUS_STYLES[s.status] ?? STATUS_STYLES.pending}`}
                    >
                      {t(`statuses.${s.status}` as `statuses.active`)}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Stack>
  );
}
