import { z } from 'zod';

import { getJson } from './client';

const helloResponseSchema = z.object({
  message: z.string(),
});

export type HelloResponse = z.infer<typeof helloResponseSchema>;

export const fetchHello = (): Promise<HelloResponse> =>
  getJson('/api/hello', helloResponseSchema);

