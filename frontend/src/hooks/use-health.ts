import { useQuery } from '@tanstack/react-query';

import { fetchHealth } from '../api/health';

export const healthQueryKey = ['api', 'health'] as const;

export const useHealth = () =>
  useQuery({
    queryKey: healthQueryKey,
    queryFn: fetchHealth,
  });

