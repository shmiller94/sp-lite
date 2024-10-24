import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { HealthScoreResult } from '@/types/api';

export const getHealthScoreByOrderId = ({
  orderId,
}: {
  orderId: string;
}): Promise<{ healthScoreResult: HealthScoreResult | null }> => {
  return api.get(`/biomarkers/orders/${orderId}/health-score/`);
};

export const getHealthScoreByOrderIdQueryOptions = (orderId: string) => {
  return queryOptions({
    queryKey: ['health-scores', orderId],
    queryFn: () => getHealthScoreByOrderId({ orderId }),
  });
};

type UseHealthScoreByOrderIdOptions = {
  orderId: string;
  queryConfig?: QueryConfig<typeof getHealthScoreByOrderIdQueryOptions>;
};

export const useHealthScoreByOrderId = ({
  orderId,
  queryConfig,
}: UseHealthScoreByOrderIdOptions) => {
  return useQuery({
    ...getHealthScoreByOrderIdQueryOptions(orderId),
    ...queryConfig,
  });
};
