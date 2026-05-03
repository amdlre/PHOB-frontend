import type { Metadata } from 'next';
import { Box } from '@amdlre/design-system';
import { generateSiteMetadata } from '@/lib/seo/metadata';
import { LandingNav } from '@/components/landing/landing-nav';
import { PlansSection } from '@/components/landing/plans-section';
import { LandingFooter } from '@/components/landing/landing-footer';
import type { PageProps } from '@/types';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateSiteMetadata(locale, { pathname: `/${locale}/plans` });
}

export default function PlansPage() {
  return (
    <Box className="min-h-screen bg-brand-offwhite pt-20">
      <LandingNav />
      <PlansSection />
      <LandingFooter />
    </Box>
  );
}
