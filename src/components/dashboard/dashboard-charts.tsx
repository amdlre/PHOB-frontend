'use client';

import { useMemo } from 'react';
import { useMessages, useTranslations, useLocale } from 'next-intl';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, Typography } from '@amdlre/design-system';
import type { CleaningRequest, RequestStatus } from '@/types/domain';

interface Props {
  requests: CleaningRequest[];
  trendDays?: number;
  /** i18n namespace: 'dashboard.employee' or 'dashboard.client' */
  namespace?: 'dashboard.employee' | 'dashboard.client';
}

const STATUS_COLORS: Record<RequestStatus, string> = {
  pending: '#94a3b8',
  scheduled: '#3b82f6',
  awaiting_guest_confirmation: '#f59e0b',
  in_progress: '#a855f7',
  completed: '#10b981',
  rejected: '#ef4444',
  cancelled: '#dc2626',
};

const TOOLTIP_STYLE = {
  background: 'white',
  border: '1px solid var(--color-brand-border)',
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 700,
  padding: '8px 12px',
};

export function DashboardCharts({
  requests,
  trendDays = 14,
  namespace = 'dashboard.employee',
}: Props) {
  const t = useTranslations(namespace);
  const tr = useTranslations('request');
  const ts = useTranslations('request.statuses');
  const messages = useMessages() as Record<string, unknown>;
  const knownStatuses = (messages?.request as Record<string, unknown> | undefined)?.statuses as
    | Record<string, string>
    | undefined;
  const locale = useLocale();

  const trendData = useMemo(() => {
    const days: Array<{ date: string; label: string; count: number }> = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = trendDays - 1; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const iso = d.toISOString().slice(0, 10);
      days.push({
        date: iso,
        label: new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
          day: 'numeric',
          month: 'short',
        }).format(d),
        count: 0,
      });
    }
    const byDay = new Map(days.map((d) => [d.date, d]));
    for (const r of requests) {
      const key = r.scheduled_at?.slice(0, 10);
      const bucket = key ? byDay.get(key) : undefined;
      if (bucket) bucket.count += 1;
    }
    return days;
  }, [requests, trendDays, locale]);

  const statusData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of requests) {
      counts.set(r.status, (counts.get(r.status) || 0) + 1);
    }
    return Array.from(counts.entries()).map(([status, count]) => ({
      status,
      label: knownStatuses && status in knownStatuses ? ts(status) : status,
      count,
      fill: STATUS_COLORS[status as RequestStatus] || '#64748b',
    }));
  }, [requests, ts, knownStatuses]);

  const hasData = requests.length > 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="text-sm font-black text-brand-black">{t('trends')}</CardTitle>
          <Typography as="p" variant="small" className="text-xs font-bold text-brand-slate">
            {t('trendsSubtitle')}
          </Typography>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full" aria-label={tr('title')}>
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                    tick={{ fill: '#64748b' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                    allowDecimals={false}
                    tick={{ fill: '#64748b' }}
                  />
                  <Tooltip cursor={{ fill: 'rgba(99,102,241,0.06)' }} contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="count" name={tr('title')} fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="text-sm font-black text-brand-black">
            {t('statusBreakdown')}
          </CardTitle>
          <Typography as="p" variant="small" className="text-xs font-bold text-brand-slate">
            {t('statusBreakdownSubtitle')}
          </Typography>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="label"
                    innerRadius={48}
                    outerRadius={88}
                    paddingAngle={2}
                  >
                    {statusData.map((s) => (
                      <Cell key={s.status} fill={s.fill} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11, fontWeight: 700 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="grid h-full place-items-center text-xs font-bold text-brand-slate">—</div>
  );
}
