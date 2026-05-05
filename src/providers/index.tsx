'use client';

import { AmdlreProvider, ConfirmProvider } from '@amdlre/design-system';
import type { AmdlreTheme } from '@amdlre/design-system';
import { AuthProvider } from './auth-provider';
import type { User } from '@/types/auth';

// ─── PHOB Design System Theme ────────────────────────────────────────────────
// Colors extracted from https://phob-so74vb.cranl.net
// Brand tokens: --color-brand-black, --color-brand-offwhite,
//               --color-brand-accent, --color-brand-slate, --color-brand-border
// Dark palette: #0f172a (bg), #1e293b (surface), #1b2b48 (card)
// Fonts:        Inter + IBM Plex Sans Arabic / JetBrains Mono
// ─────────────────────────────────────────────────────────────────────────────

const phobTheme: AmdlreTheme = {
  colors: {
    background: '210 17% 98%',
    foreground: '240 4% 4%',

    primary: '240 4% 4%',        // #0a0a0b — black
    primaryForeground: '0 0% 100%',

    secondary: '239 85% 67%',      // #6467f2 — indigo
    secondaryForeground: '0 0% 100%',

    muted: '210 17% 96%',
    mutedForeground: '215 16% 47%',

    accent: '239 100% 97%',
    accentForeground: '239 85% 35%',

    destructive: '0 84% 60%',
    destructiveForeground: '0 0% 100%',

    border: '214 32% 91%',
    input: '214 32% 91%',
    ring: '239 85% 67%',      // secondary color for focus rings

    card: '0 0% 100%',
    cardForeground: '240 4% 4%',
    popover: '0 0% 100%',
    popoverForeground: '240 4% 4%',
  },

  darkColors: {
    background: '222 47% 11%',
    foreground: '210 40% 98%',

    primary: '210 40% 98%',      // near-white in dark mode
    primaryForeground: '240 4% 4%',

    secondary: '239 85% 72%',      // slightly lighter indigo for dark
    secondaryForeground: '0 0% 100%',

    muted: '217 32% 17%',
    mutedForeground: '215 20% 65%',

    accent: '239 50% 22%',
    accentForeground: '239 85% 85%',

    destructive: '0 63% 31%',
    destructiveForeground: '210 40% 98%',

    border: '217 32% 17%',
    input: '217 32% 17%',
    ring: '239 85% 72%',

    card: '219 45% 19%',
    cardForeground: '210 40% 98%',
    popover: '222 47% 11%',
    popoverForeground: '210 40% 98%',
  },

  fonts: {
    sans: '"IBM Plex Sans Arabic", system-ui, sans-serif',
    heading: '"IBM Plex Sans Arabic", system-ui, sans-serif',
  },
};
interface ProvidersProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export function Providers({ children, initialUser = null }: ProvidersProps) {
  return (
    <AmdlreProvider theme={phobTheme}>
      <ConfirmProvider>
        <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
      </ConfirmProvider>
    </AmdlreProvider>
  );
}