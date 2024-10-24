import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { HealthScoreResult } from '@/types/api';

export type GetHealthScoresResponse = {
  healthScoreResult: HealthScoreResult;
  orderId: string;
  timestamp: string;
};

export const getHealthScores = async (): Promise<{
  healthScores: GetHealthScoresResponse[];
}> => {
  return api.get('/biomarkers/health-score');
};

export const getHealthScoresQueryOptions = () => {
  return queryOptions({
    queryKey: ['health-scores'],
    queryFn: () => getHealthScores(),
  });
};

type UseHealthScoresOptions = {
  queryConfig?: QueryConfig<typeof getHealthScoresQueryOptions>;
};

export const useHealthScores = ({
  queryConfig,
}: UseHealthScoresOptions = {}) => {
  return useQuery({
    ...getHealthScoresQueryOptions(),
    ...queryConfig,
  });
};
