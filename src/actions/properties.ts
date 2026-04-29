'use server';

import { revalidatePath } from 'next/cache';
import { api, ApiException } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { propertySchema } from '@/lib/validations/property';
import type { Property } from '@/types/domain';
import type { ActionResult } from './auth';

interface CreatePropertyInput {
  building_name: string;
  floor_number?: string;
  unit_number?: string;
  door_code?: string;
  address?: string;
  lat?: number;
  lng?: number;
  images?: string[];
}

export async function createPropertyAction(
  input: CreatePropertyInput,
): Promise<ActionResult & { property?: Property }> {
  const parsed = propertySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const res = await api.post<Property>(ENDPOINTS.properties.create, parsed.data);
    revalidatePath('/dashboard');
    revalidatePath('/properties');
    return { success: true, property: res.data, redirect: '/properties' };
  } catch (err) {
    if (err instanceof ApiException) {
      return { success: false, message: err.message, errors: err.errors };
    }
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
}

export async function updatePropertyAction(
  id: string,
  input: Partial<CreatePropertyInput>,
): Promise<ActionResult & { property?: Property }> {
  try {
    const res = await api.patch<Property>(ENDPOINTS.properties.update(id), input);
    revalidatePath(`/properties/${id}`);
    revalidatePath('/properties');
    return { success: true, property: res.data };
  } catch (err) {
    if (err instanceof ApiException) {
      return { success: false, message: err.message };
    }
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
}

export async function deletePropertyAction(id: string): Promise<ActionResult> {
  try {
    await api.delete(ENDPOINTS.properties.delete(id));
    revalidatePath('/properties');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    if (err instanceof ApiException) return { success: false, message: err.message };
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
}
