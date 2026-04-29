'use client';

import { AmdlreProvider, presetThemes } from '@amdlre/design-system';
import { AuthProvider } from './auth-provider';
import type { User } from '@/types/auth';

const projectTheme = presetThemes.ocean;

interface ProvidersProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export function Providers({ children, initialUser = null }: ProvidersProps) {
  return (
    <AmdlreProvider theme={projectTheme}>
      <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
    </AmdlreProvider>
  );
}
