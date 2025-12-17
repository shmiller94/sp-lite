import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { SummaryResult } from '@/types/api';

export const getSummary = (): Promise<SummaryResult> => {
  return api.get(`/summary`);
};

export const getSummaryQueryOptions = () => {
  return queryOptions({
    queryKey: ['summary'],
    queryFn: () => getSummary(),
  });
};

type UseSummaryOptions = {
  queryConfig?: QueryConfig<typeof getSummaryQueryOptions>;
};

export const useSummary = ({ queryConfig }: UseSummaryOptions = {}) => {
  return useQuery({
    ...getSummaryQueryOptions(),
    ...queryConfig,
  });
};
