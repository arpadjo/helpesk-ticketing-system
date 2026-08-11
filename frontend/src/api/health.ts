import { z } from 'zod';

import { requestJson } from './client';

const healthResponseSchema = z.object({
  status: z.literal('ok'),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const fetchHealth = (): Promise<HealthResponse> =>
  requestJson('/health', healthResponseSchema);
