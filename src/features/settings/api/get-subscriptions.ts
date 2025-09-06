import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Subscription } from '@/types/api';

export const getSubscriptions = (): Promise<{
  subscriptions: Subscription[];
}> => {
  return api.get(`/billing/subscriptions`);
};

export const getSubscriptionsQueryOptions = () => {
  return queryOptions({
    queryKey: ['subscriptions'],
    queryFn: () => getSubscriptions(),
  });
};

type useSubscriptionsOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getSubscriptionsQueryOptions>;
};

export const useSubscriptions = ({
  queryConfig,
}: useSubscriptionsOptions = {}) => {
  return useQuery({
    ...getSubscriptionsQueryOptions(),
    ...queryConfig,
  });
};
