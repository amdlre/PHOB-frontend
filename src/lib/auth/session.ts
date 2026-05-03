import 'server-only';
import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { getAccessToken } from './tokens';
import type { User } from '@/types/auth';

export { dashboardPathFor } from './paths';

export async function getCurrentUser(): Promise<User | null> {
  const token = await getAccessToken();
  if (!token) return null;
  try {
    const res = await api.get<User>(ENDPOINTS.auth.me);
    return res.data;
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  return !!token;
}
