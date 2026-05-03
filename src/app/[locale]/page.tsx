import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Box } from '@amdlre/design-system';
import { generateSiteMetadata } from '@/lib/seo/metadata';
import { getCurrentUser, dashboardPathFor } from '@/lib/auth/session';
import { LandingNav } from '@/components/landing/landing-nav';
import { HeroSection } from '@/components/landing/hero-section';
import { ServicesSection } from '@/components/landing/services-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { BentoSection } from '@/components/landing/bento-section';
import { CtaFinalSection } from '@/components/landing/cta-final-section';
import { LandingFooter } from '@/components/landing/landing-footer';
import type { PageProps } from '@/types';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateSiteMetadata(locale, { pathname: `/${locale}` });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (user) {
    redirect(`/${locale}${dashboardPathFor(user.role)}`);
  }

  return (
    <Box className="min-h-screen bg-brand-offwhite pt-20">
      <LandingNav />
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <BentoSection />
      <CtaFinalSection />
      <LandingFooter />
    </Box>
  );
}
