import { z } from 'zod';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const API_PREFIX = '/api/v1';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
};

export const requestJson = async <T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestOptions = {},
): Promise<T> => {
  const body = options.body === undefined ? undefined : JSON.stringify(options.body);

  const request = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    method: options.method ?? 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body,
  });

  if (!request.ok) {
    const errorBody = await request.json().catch(() => null) as { error?: string } | null;
    throw new Error(errorBody?.error ?? `API request failed with status ${request.status}`);
  }

  if (request.status === 204) {
    return undefined as T;
  }

  return schema.parse(await request.json());
};
