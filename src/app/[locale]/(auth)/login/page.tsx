import type { Metadata } from 'next';
import { Box, Flex } from '@amdlre/design-system';
import { generateSiteMetadata } from '@/lib/seo/metadata';
import { LoginForm } from '@/components/forms/login-form';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import type { PageProps } from '@/types';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateSiteMetadata(locale, {
    title: locale === 'ar' ? 'تسجيل الدخول' : 'Sign In',
    pathname: '/login',
    noIndex: true,
  });
}

export default function LoginPage() {
  return (
    <Flex align="center" justify="center" className="relative min-h-screen px-6 py-16">
      <Box className="absolute end-6 top-6">
        <LanguageSwitcher />
      </Box>
      <LoginForm />
    </Flex>
  );
}
