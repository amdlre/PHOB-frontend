'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { api, ApiException } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { setAuthTokens, clearAuthTokens } from '@/lib/auth/tokens';
import { loginSchema, registerSchema } from '@/lib/validations/auth';
import { dashboardPathFor } from '@/lib/auth/session';
import type { AuthTokens, User } from '@/types/auth';

export interface ActionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  redirect?: string;
}

export async function loginAction(formData: FormData): Promise<ActionResult> {
  const raw = {
    identifier: (formData.get('identifier') as string) || '',
    password: (formData.get('password') as string) || '',
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const res = await api.post<AuthTokens>(ENDPOINTS.auth.login, parsed.data, { noAuth: true });
    const { access_token, refresh_token, user } = res.data;
    await setAuthTokens(access_token, refresh_token);
    const path = dashboardPathFor(user?.role);
    return { success: true, redirect: path };
  } catch (err) {
    if (err instanceof ApiException) {
      return { success: false, message: err.message, errors: err.errors };
    }
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
}

export async function registerAction(formData: FormData): Promise<ActionResult> {
  const raw = {
    name: (formData.get('name') as string) || '',
    email: (formData.get('email') as string) || '',
    phone: (formData.get('phone') as string) || '',
    password: (formData.get('password') as string) || '',
    password_confirmation: (formData.get('password_confirmation') as string) || '',
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const res = await api.post<AuthTokens>(ENDPOINTS.auth.register, parsed.data, {
      noAuth: true,
    });
    await setAuthTokens(res.data.access_token, res.data.refresh_token);
    return { success: true, redirect: '/dashboard' };
  } catch (err) {
    if (err instanceof ApiException) {
      return { success: false, message: err.message, errors: err.errors };
    }
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
}

export async function logoutAction(): Promise<void> {
  try {
    await api.post(ENDPOINTS.auth.logout);
  } catch {
    // ignore
  }
  await clearAuthTokens();
  revalidatePath('/');
  redirect('/login');
}

export async function getMeAction(): Promise<User | null> {
  try {
    const res = await api.get<User>(ENDPOINTS.auth.me);
    return res.data;
  } catch {
    return null;
  }
}
