import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Credit } from '@/types/api';

export const getCredits = (): Promise<{ credits: Credit[] }> => {
  return api.get('/credits');
};

export const getCreditsQueryOptions = () => {
  return queryOptions({
    queryKey: ['credits'],
    queryFn: () => getCredits(),
    // this is on purpose to remove issues with credits / etc
    // added oct 7, 2025 by NM
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
};

type UseCreditsOptions = {
  queryConfig?: QueryConfig<typeof getCreditsQueryOptions>;
};

export const useCredits = ({ queryConfig }: UseCreditsOptions = {}) => {
  return useQuery({
    ...getCreditsQueryOptions(),
    ...queryConfig,
  });
};
