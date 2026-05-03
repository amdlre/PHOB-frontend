import { getTranslations } from 'next-intl/server';
import { Search } from 'lucide-react';
import {
  Box,
  Button,
  Input,
  NativeSelect,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { formatDate } from '@/lib/utils';
import type { Subscription } from '@/types/domain';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  expired: 'bg-slate-100 text-slate-700 border-slate-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default async function EmployeeSubscriptionsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations('subscription');

  let subs: Subscription[] = [];
  try {
    const res = await api.get<Subscription[]>(ENDPOINTS.subscriptions.list, {
      params: { client: sp.client, building: sp.building, status: sp.status, from: sp.from, to: sp.to },
    });
    subs = res.data;
  } catch {
    subs = [];
  }

  return (
    <Stack gap={6} className="pb-24">
      <Typography as="h1" variant="h1" className="text-3xl font-black tracking-tight text-brand-black">
        {t('title')}
      </Typography>

      <form className="card-premium grid gap-3 p-6 md:grid-cols-5">
        <Input name="client" placeholder="اسم العميل" defaultValue={sp.client ?? ''} className="input-base text-right" />
        <Input name="building" placeholder="العمارة" defaultValue={sp.building ?? ''} className="input-base text-right" />
        <NativeSelect name="status" defaultValue={sp.status ?? ''} className="input-base text-right">
          <option value="">—</option>
          {(['active', 'pending', 'expired', 'cancelled'] as const).map((s) => (
            <option key={s} value={s}>
              {t(`statuses.${s}` as 'statuses.active')}
            </option>
          ))}
        </NativeSelect>
        <Input name="from" type="date" defaultValue={sp.from ?? ''} className="input-base text-right" />
        <Button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand-black py-3 text-xs font-black text-white"
        >
          <Search size={14} /> بحث
        </Button>
      </form>

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
            {subs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-6 py-12 text-center text-sm font-bold text-brand-slate">
                  {t('noSubscriptions')}
                </TableCell>
              </TableRow>
            ) : (
              subs.map((s) => (
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
                      {t(`statuses.${s.status}` as 'statuses.active')}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
    </Stack>
  );
}
