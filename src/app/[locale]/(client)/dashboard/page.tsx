import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Building2, Calendar, CheckCircle2, Clock, Plus, Sparkles } from 'lucide-react';
import {
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
import type { Property, CleaningRequest, Subscription } from '@/types/domain';
import type { PageProps } from '@/types';

async function loadData() {
  const [propsRes, reqsRes, subsRes] = await Promise.allSettled([
    api.get<Property[]>(ENDPOINTS.properties.list),
    api.get<CleaningRequest[]>(ENDPOINTS.requests.list),
    api.get<Subscription[]>(ENDPOINTS.subscriptions.list),
  ]);
  return {
    properties: propsRes.status === 'fulfilled' ? propsRes.value.data : [],
    requests: reqsRes.status === 'fulfilled' ? reqsRes.value.data : [],
    subscriptions: subsRes.status === 'fulfilled' ? subsRes.value.data : [],
  };
}

export default async function ClientDashboardPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('dashboard.client');
  const user = await getCurrentUser();
  const { properties, requests, subscriptions } = await loadData();

  const stats: Array<{
    label: string;
    value: number;
    Icon: typeof Building2;
    iconClass: string;
    valueTone: 'default' | 'success' | 'warning' | 'info';
  }> = [
    {
      label: t('totalUnits'),
      value: properties.length,
      Icon: Building2,
      iconClass: 'text-brand-accent bg-brand-accent/10',
      valueTone: 'default',
    },
    {
      label: t('activeSubs'),
      value: subscriptions.filter((s) => s.status === 'active').length,
      Icon: Sparkles,
      iconClass: 'text-emerald-600 bg-emerald-50',
      valueTone: 'success',
    },
    {
      label: t('pendingRequests'),
      value: requests.filter((r) => ['pending', 'scheduled'].includes(r.status)).length,
      Icon: Clock,
      iconClass: 'text-amber-600 bg-amber-50',
      valueTone: 'warning',
    },
    {
      label: t('completedRequests'),
      value: requests.filter((r) => r.status === 'completed').length,
      Icon: CheckCircle2,
      iconClass: 'text-blue-600 bg-blue-50',
      valueTone: 'info',
    },
  ];

  const actions = [
    { href: `/${locale}/properties/add`, label: t('addProperty'), Icon: Plus },
    { href: `/${locale}/subscriptions/new`, label: t('newSubscription'), Icon: Sparkles },
    { href: `/${locale}/requests/new`, label: t('newRequest'), Icon: Calendar },
  ];

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

      <Stack as="section" gap={4}>
        <Typography as="h2" variant="large" className="font-black">
          {t('quickActions')}
        </Typography>
        <Grid gap={4} className="md:grid-cols-3">
          {actions.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="card-premium flex items-center gap-4 p-6 transition-transform hover:-translate-y-1"
            >
              <Flex
                align="center"
                justify="center"
                className="h-12 w-12 rounded-2xl bg-brand-black text-white"
              >
                <Icon size={20} strokeWidth={1.75} />
              </Flex>
              <Typography as="span" variant="small" className="font-black">
                {label}
              </Typography>
            </Link>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
}
