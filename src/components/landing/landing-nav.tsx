'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Box, Button, Flex, Stack, Typography } from '@amdlre/design-system';
import { Logo } from '@/components/shared/logo';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { useAuth } from '@/providers/auth-provider';
import { dashboardPathFor } from '@/lib/auth/paths';

export function LandingNav() {
  const t = useTranslations('landing');
  const params = useParams<{ locale: string }>();
  const pathname = usePathname();
  const locale = params?.locale ?? 'ar';
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const home = `/${locale}`;
  const plans = `/${locale}/plans`;
  const faq = `/${locale}/faq`;
  const dashboard = `/${locale}${dashboardPathFor(user?.role)}`;
  const isHome = pathname === home;
  const isPlans = pathname === plans;
  const isFaq = pathname === faq;
  const isDashboard = pathname.includes('dashboard');

  const scrollToTop = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Flex
      as="nav"
      align="center"
      className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-brand-border/50 bg-white/70 backdrop-blur-xl"
    >
      <Box className="mx-auto w-full max-w-7xl px-6">
        <Flex align="center" justify="between" className="h-20">
          <Flex align="center" gap={12}>
            <Link href={home} onClick={scrollToTop} className="group ml-4 flex items-center">
              <Logo size="md" className="text-brand-black" />
            </Link>

            <Flex align="center" gap={8} className="hidden md:flex">
              <Link
                href={home}
                onClick={scrollToTop}
                className={`text-[13px] font-semibold transition-all hover:text-brand-accent ${isHome ? 'text-brand-accent' : 'text-brand-slate'
                  }`}
              >
                {t('navHome')}
              </Link>
              <Link
                href={plans}
                className={`text-[13px] font-semibold transition-all hover:text-brand-accent ${isPlans ? 'text-brand-accent' : 'text-brand-slate'
                  }`}
              >
                {t('navPlans')}
              </Link>
              <Link
                href={faq}
                className={`text-[13px] font-semibold transition-all hover:text-brand-accent ${isFaq ? 'text-brand-accent' : 'text-brand-slate'
                  }`}
              >
                {t('navFaq')}
              </Link>
              {isLoggedIn ? (
                <Link
                  href={dashboard}
                  className={`text-[13px] font-semibold transition-all hover:text-brand-accent ${isDashboard ? 'text-brand-accent' : 'text-brand-slate'
                    }`}
                >
                  {t('navDashboard')}
                </Link>
              ) : null}
            </Flex>
          </Flex>

          <Flex align="center" gap={4}>
            <LanguageSwitcher />
            {isLoggedIn ? (
              <Flex align="center" gap={6}>
                <Stack gap={0} className="hidden items-end sm:flex">
                  <Typography
                    as="span"
                    variant="small"
                    className="text-[10px] font-black uppercase tracking-widest opacity-60"
                  >
                    {t('userWelcome')}
                  </Typography>
                  <Typography
                    as="span"
                    variant="small"
                    className="text-[14px] font-black text-brand-black"
                  >
                    {user.name}
                  </Typography>
                </Stack>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => logout()}
                  leftIcon={<LogOut size={14} />}
                  className="rounded-2xl bg-red-50/50 px-5 py-2.5 text-[12px] font-bold text-red-500 hover:bg-red-500 hover:text-white"
                >
                  {t('ctaLogout')}
                </Button>
              </Flex>
            ) : (
              <Button
                leftIcon={<UserIcon size={16} />}
                href={`/login`}
                locale={locale}
                size={"lg"}
                rounded={"xl"}
              >
                {t('ctaLogin')}
              </Button>
            )}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}
