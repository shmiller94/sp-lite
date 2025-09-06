import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { AvailableSubscription } from '@/types/api';

export const getAvailableSubscriptions = (
  coupon?: string,
  state?: string,
): Promise<AvailableSubscription[]> => {
  const params = new URLSearchParams();

  if (coupon) params.append('code', coupon);
  if (state) params.append('state', state);

  const query = params.toString();
  return api.get(`billing/subscriptions/available${query ? `?${query}` : ''}`);
};

export const availableSubscriptionsQueryOptions = (
  coupon?: string,
  state?: string,
) => {
  return queryOptions({
    // we dont need cache key here because its highly dynamic
    queryKey: ['availableSubscriptions', coupon, state],
    queryFn: () => getAvailableSubscriptions(coupon, state),
  });
};

type UseAvailableSubscriptionsOptions = {
  coupon?: string;
  state?: string;
  queryConfig?: QueryConfig<typeof availableSubscriptionsQueryOptions>;
};

/*
 * Returns price for superpower base membership
 * */
export const useAvailableSubscriptions = ({
  queryConfig,
  coupon,
  state,
}: UseAvailableSubscriptionsOptions = {}) => {
  return useQuery({
    ...availableSubscriptionsQueryOptions(coupon, state),
    ...queryConfig,
  });
};
