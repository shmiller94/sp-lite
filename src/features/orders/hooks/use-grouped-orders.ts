import { useMemo } from 'react';

import { getOrdersQueryOptions, useOrders } from '@/features/orders/api';
import { getServicesQueryOptions, useServices } from '@/features/services/api';
import { QueryConfig } from '@/lib/react-query';
import { HealthcareService, Order } from '@/types/api';

export const useGroupedOrders = ({
  servicesQueryConfig,
  ordersQueryConfig,
}: {
  servicesQueryConfig?: QueryConfig<typeof getServicesQueryOptions>;
  ordersQueryConfig?: QueryConfig<typeof getOrdersQueryOptions>;
} = {}) => {
  const getOrdersQuery = useOrders({ queryConfig: ordersQueryConfig });
  const getServicesQuery = useServices({ queryConfig: servicesQueryConfig });

  return useMemo(() => {
    const all = getOrdersQuery.data?.orders ?? [];

    const buckets: {
      drafts: { order: Order; service?: HealthcareService }[];
      pending: { order: Order; service?: HealthcareService }[];
      active: { order: Order; service?: HealthcareService }[];
      completed: { order: Order; service?: HealthcareService }[];
      canceled: { order: Order; service?: HealthcareService }[];
    } = {
      drafts: [],
      pending: [],
      active: [],
      completed: [],
      canceled: [],
    };

    for (const o of all) {
      const s = getServicesQuery.data?.services.find(
        (s) => s.id === o.serviceId,
      );
      switch (o.status) {
        case 'DRAFT':
          buckets.drafts.push({ order: o, service: s });
          break;
        case 'PENDING':
          buckets.pending.push({ order: o, service: s });
          break;
        case 'COMPLETED':
          buckets.completed.push({ order: o, service: s });
          break;
        case 'CANCELLED':
          buckets.canceled.push({ order: o, service: s });
          break;
      }
    }

    return {
      buckets,
      all,
      groupedOrdersLoading:
        getOrdersQuery.isLoading || getServicesQuery.isLoading,
    };
  }, [
    getServicesQuery.data,
    getOrdersQuery.data,
    getOrdersQuery.isLoading,
    getServicesQuery.isLoading,
  ]);
};
