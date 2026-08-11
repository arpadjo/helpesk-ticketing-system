import { z } from 'zod';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const getJson = async <T>(path: string, schema: z.ZodType<T>): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return schema.parse(await response.json());
};

