import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Order } from '@/types/api';

export const getOrders = (): Promise<{ orders: Order[] }> => {
  return api.get('/orders');
};

export const getOrdersQueryOptions = () => {
  return queryOptions({
    queryKey: ['orders'],
    queryFn: () => getOrders(),
    // this is on purpose to remove issues with credits / etc
    // added oct 7, 2025 by NM
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
};

type UseOrdersOptions = {
  queryConfig?: QueryConfig<typeof getOrdersQueryOptions>;
};

export const useOrders = ({ queryConfig }: UseOrdersOptions = {}) => {
  return useQuery({
    ...getOrdersQueryOptions(),
    ...queryConfig,
  });
};
