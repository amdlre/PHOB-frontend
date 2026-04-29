import { cookies } from 'next/headers';
import { APP_CONFIG } from '@/constants/config';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  isClient?: boolean;
  noAuth?: boolean;
  baseUrl?: string;
  isFormData?: boolean;
}

export class ApiException extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor({ message, status, errors }: ApiError) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.errors = errors;
  }
}

async function getAuthToken(isClient: boolean): Promise<string | null> {
  if (isClient) return null;
  try {
    const cookieStore = await cookies();
    return cookieStore.get(APP_CONFIG.auth.cookieName)?.value || null;
  } catch {
    return null;
  }
}

export async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const {
    body,
    params,
    isClient = false,
    noAuth = false,
    baseUrl,
    isFormData = false,
    headers: customHeaders,
    ...rest
  } = options;

  const base = baseUrl || APP_CONFIG.api.baseUrl;
  const url = endpoint.startsWith('http') ? new URL(endpoint) : new URL(base + endpoint);

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, String(v));
      }
    });
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(customHeaders as Record<string, string> | undefined),
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (!noAuth) {
    const token = await getAuthToken(isClient);
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let payload: BodyInit | undefined;
  if (body !== undefined) {
    if (isFormData && body instanceof FormData) {
      payload = body;
    } else {
      payload = JSON.stringify(body);
    }
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      ...rest,
      headers,
      body: payload,
    });
  } catch (e) {
    throw new ApiException({
      message: e instanceof Error ? e.message : 'Network error',
      status: 0,
    });
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    if (!response.ok) {
      throw new ApiException({
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      });
    }
    return { data: null as T, status: response.status, success: true };
  }

  const json = await response.json();

  if (!response.ok) {
    throw new ApiException({
      message: json.detail || json.message || `HTTP ${response.status}`,
      status: response.status,
      errors: json.errors,
    });
  }

  return {
    data: (json.data ?? json) as T,
    message: json.message,
    status: response.status,
    success: true,
  };
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'POST', body }),
  put: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'PUT', body }),
  patch: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'PATCH', body }),
  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'DELETE' }),
  upload: <T>(endpoint: string, formData: FormData, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'POST', body: formData, isFormData: true }),
};
