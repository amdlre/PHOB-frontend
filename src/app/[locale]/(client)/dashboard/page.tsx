import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Building2, Calendar, CheckCircle2, Clock, Plus, Sparkles } from 'lucide-react';
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

  const stats = [
    {
      label: t('totalUnits'),
      value: properties.length,
      icon: Building2,
      color: 'text-brand-accent bg-brand-accent/10',
    },
    {
      label: t('activeSubs'),
      value: subscriptions.filter((s) => s.status === 'active').length,
      icon: Sparkles,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: t('pendingRequests'),
      value: requests.filter((r) => ['pending', 'scheduled'].includes(r.status)).length,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: t('completedRequests'),
      value: requests.filter((r) => r.status === 'completed').length,
      icon: CheckCircle2,
      color: 'text-blue-600 bg-blue-50',
    },
  ];

  const actions = [
    { href: `/${locale}/properties/add`, label: t('addProperty'), icon: Plus },
    { href: `/${locale}/subscriptions/new`, label: t('newSubscription'), icon: Sparkles },
    { href: `/${locale}/requests/new`, label: t('newRequest'), icon: Calendar },
  ];

  return (
    <div className="space-y-8 pb-24">
      <div>
        <h1 className="mb-2 text-3xl font-black tracking-tight text-brand-black">
          {t('welcome', { name: user?.name || '' })}
        </h1>
        <p className="text-sm font-bold text-brand-slate">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card-premium p-6">
              <div className={`mb-4 grid h-10 w-10 place-items-center rounded-2xl ${s.color}`}>
                <Icon size={18} strokeWidth={1.75} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-slate">
                {s.label}
              </p>
              <p className="mt-1 text-3xl font-black text-brand-black">{s.value}</p>
            </div>
          );
        })}
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-black text-brand-black">{t('quickActions')}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                className="card-premium flex items-center gap-4 p-6 transition-transform hover:-translate-y-1"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-black text-white">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <span className="text-sm font-black text-brand-black">{a.label}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
