'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { AuthState, User } from '@/types/auth';

interface AuthContextValue extends AuthState {
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  const [state, setState] = useState<AuthState>({
    user: initialUser,
    isLoading: false,
    isAuthenticated: !!initialUser,
  });

  useEffect(() => {
    setState({
      user: initialUser,
      isLoading: false,
      isAuthenticated: !!initialUser,
    });
  }, [initialUser]);

  const setUser = useCallback((user: User | null) => {
    setState({ user, isLoading: false, isAuthenticated: !!user });
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setState({ user: null, isLoading: false, isAuthenticated: false });
      window.location.href = '/login';
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, setUser, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
