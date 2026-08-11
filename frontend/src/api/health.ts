import { z } from 'zod';

import { getJson } from './client';

const healthResponseSchema = z.object({
  status: z.literal('ok'),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const fetchHealth = (): Promise<HealthResponse> =>
  getJson('/api/health', healthResponseSchema);

