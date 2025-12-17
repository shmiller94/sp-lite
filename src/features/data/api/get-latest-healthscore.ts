import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { BiomarkerResult } from '@/types/api';

export const getLatestHealthScore = async (): Promise<{
  healthScore: BiomarkerResult | null;
}> => {
  return await api.get(`/biomarkers/healthscore/latest`);
};

export const getLatestHealthScoreQueryOptions = () => {
  return queryOptions({
    queryKey: ['healthScore', 'latest'],
    queryFn: () => getLatestHealthScore(),
  });
};

type UseLatestHealthScoreOptions = {
  queryConfig?: QueryConfig<typeof getLatestHealthScoreQueryOptions>;
};

export const useLatestHealthScore = ({
  queryConfig,
}: UseLatestHealthScoreOptions = {}) => {
  return useQuery({
    ...getLatestHealthScoreQueryOptions(),
    ...queryConfig,
  });
};
