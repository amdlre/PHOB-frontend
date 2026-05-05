import Link from 'next/link';
import { CheckCircle2, Clock, Hourglass, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import {
  Card,
  CardContent,
  Flex,
  Grid,
  HeaderInfo,
  Stack,
  StatCard,
  Typography,
} from '@amdlre/design-system';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { getCurrentUser } from '@/lib/auth/session';
import { RequestStatusBadge } from '@/components/shared/request-status-badge';
import { DashboardCharts } from '@/components/dashboard/dashboard-charts';
import { formatDateTime } from '@/lib/utils';
import type { CleaningRequest, Subscription } from '@/types/domain';
import type { PageProps } from '@/types';

export default async function EmployeeDashboardPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('dashboard.employee');
  const user = await getCurrentUser();

  let requests: CleaningRequest[] = [];
  let subs: Subscription[] = [];
  try {
    const [r, s] = await Promise.allSettled([
      api.get<CleaningRequest[]>(ENDPOINTS.requests.list),
      api.get<Subscription[]>(ENDPOINTS.subscriptions.list),
    ]);
    if (r.status === 'fulfilled') requests = r.value.data;
    if (s.status === 'fulfilled') subs = s.value.data;
  } catch {
    // ignore
  }

  const todayIso = new Date().toISOString().slice(0, 10);
  const todayCount = requests.filter((r) => r.scheduled_at?.startsWith(todayIso)).length;
  const pending = requests.filter((r) => r.status === 'pending').length;
  const inProgress = requests.filter((r) => r.status === 'in_progress').length;
  const completed = requests.filter((r) => r.status === 'completed').length;

  const expiring = subs.filter((s) => {
    if (s.status !== 'active') return false;
    const end = new Date(s.end_date).getTime();
    return end - Date.now() < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const pendingReports = requests.filter((r) => r.status === 'completed' && !r.report).length;

  const stats: Array<{
    label: string;
    value: number;
    Icon: typeof Clock;
    iconClass: string;
    valueTone: 'info' | 'warning' | 'default' | 'success';
  }> = [
    {
      label: t('todayRequests'),
      value: todayCount,
      Icon: Clock,
      iconClass: 'text-blue-600 bg-blue-50',
      valueTone: 'info',
    },
    {
      label: t('pending'),
      value: pending,
      Icon: Hourglass,
      iconClass: 'text-amber-600 bg-amber-50',
      valueTone: 'warning',
    },
    {
      label: t('inProgress'),
      value: inProgress,
      Icon: Sparkles,
      iconClass: 'text-purple-600 bg-purple-50',
      valueTone: 'default',
    },
    {
      label: t('completed'),
      value: completed,
      Icon: CheckCircle2,
      iconClass: 'text-emerald-600 bg-emerald-50',
      valueTone: 'success',
    },
  ];

  const upcoming = requests
    .filter((r) => ['scheduled', 'awaiting_guest_confirmation', 'in_progress'].includes(r.status))
    .slice(0, 5);

  return (
    <Stack gap={8} className="pb-24">
      <HeaderInfo
        title={t('welcome', { name: user?.name || '' })}
        subtitle={t('subtitle')}
      />

      <Grid gap={4} className="grid-cols-2 md:grid-cols-4">
        {stats.map(({ label, value, Icon, iconClass, valueTone }) => (
          <StatCard
            key={label}
            label={label}
            value={value}
            valueTone={valueTone}
            icon={
              <Flex
                align="center"
                justify="center"
                className={`h-10 w-10 rounded-2xl ${iconClass}`}
              >
                <Icon size={18} strokeWidth={1.75} />
              </Flex>
            }
          />
        ))}
      </Grid>

      <Grid gap={4} className="md:grid-cols-2">
        <Card className="card-premium">
          <CardContent className="p-6">
            <Typography as="h3" variant="small" className="mb-3 font-black">
              {t('expiringSubs')}
            </Typography>
            <Typography as="p" variant="large" className="text-4xl font-black text-amber-600">
              {expiring}
            </Typography>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-6">
            <Typography as="h3" variant="small" className="mb-3 font-black">
              {t('pendingReports')}
            </Typography>
            <Typography as="p" variant="large" className="text-4xl font-black text-red-500">
              {pendingReports}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <DashboardCharts requests={requests} />

      <Stack as="section" gap={3}>
        <Typography as="h2" variant="large" className="font-black">
          {t('todayRequests')}
        </Typography>
        {upcoming.length === 0 ? (
          <Card className="card-premium">
            <CardContent className="p-8 text-center">
              <Typography as="span" variant="small" className="font-bold text-brand-slate">
                —
              </Typography>
            </CardContent>
          </Card>
        ) : (
          upcoming.map((r) => (
            <Link
              key={r.id}
              href={`/${locale}/employee/requests/${r.id}`}
              className="card-premium flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <Stack gap={1}>
                <Typography as="span" variant="small" className="font-black">
                  {r.property_name}
                </Typography>
                <Typography
                  as="span"
                  variant="muted"
                  className="text-xs font-bold"
                  dir="ltr"
                >
                  {formatDateTime(r.scheduled_at, locale)}
                </Typography>
              </Stack>
              <RequestStatusBadge status={r.status} />
            </Link>
          ))
        )}
      </Stack>
    </Stack>
  );
}
