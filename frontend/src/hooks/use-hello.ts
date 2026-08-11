import { useQuery } from '@tanstack/react-query';

import { fetchHello } from '../api/hello';

export const helloQueryKey = ['api', 'hello'] as const;

export const useHello = () =>
  useQuery({
    queryKey: helloQueryKey,
    queryFn: fetchHello,
  });

