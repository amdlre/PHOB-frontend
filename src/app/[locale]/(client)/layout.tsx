import { redirect } from 'next/navigation';
import { Building2, Calendar, Home, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getCurrentUser } from '@/lib/auth/session';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import type { PageProps } from '@/types';

export default async function ClientLayout({
  children,
  params,
}: PageProps & { children: React.ReactNode }) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);
  if (user.role !== 'client') redirect(`/${locale}/employee/dashboard`);

  const t = await getTranslations('nav');

  const navItems = [
    { href: `/${locale}/dashboard`, label: t('dashboard'), icon: Home },
    { href: `/${locale}/properties`, label: t('properties'), icon: Building2 },
    { href: `/${locale}/subscriptions`, label: t('subscriptions'), icon: Sparkles },
    { href: `/${locale}/requests`, label: t('requests'), icon: Calendar },
  ];

  return (
    <DashboardShell user={user} navItems={navItems} basePath={`/${locale}/dashboard`}>
      {children}
    </DashboardShell>
  );
}
