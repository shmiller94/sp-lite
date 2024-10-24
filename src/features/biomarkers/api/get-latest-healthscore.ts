import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { HealthScoreResult } from '@/types/api';

export const getLatestHealthScore = async (): Promise<{
  healthScoreResult: HealthScoreResult | null;
}> => {
  return api.get('/biomarkers/health-score/latest');
};

export const getLatestHealthScoreQueryOptions = () => {
  return queryOptions({
    queryKey: ['latest-health-scores'],
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
