import { useMutation, useQueryClient } from '@tanstack/react-query';

import { isBloodPanel } from '@/const/services';
import { CreateOrderInput } from '@/features/orders/api/create-order';
import { getOrdersQueryOptions } from '@/features/orders/api/get-orders';
import { getServicesQueryOptions, useServices } from '@/features/services/api';
import { useAnalytics } from '@/hooks/use-analytics';
import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Order } from '@/types/api';

export const createBulkOrders = ({
  data,
}: {
  data: CreateOrderInput[];
}): Promise<{ orders: Order[] }> => {
  return api.post('/orders/bulk', data);
};

type UseCreateBulkOrderOptions = {
  mutationConfig?: MutationConfig<typeof createBulkOrders>;
};

export const useCreateBulkOrders = ({
  mutationConfig,
}: UseCreateBulkOrderOptions = {}) => {
  const queryClient = useQueryClient();
  const { track } = useAnalytics();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  const { data: servicesData } = useServices();

  return useMutation({
    onSuccess: (response, variables, context) => {
      // Track order events for each order in the bulk creation
      const orders = response.orders;

      orders.forEach((order) => {
        const service = servicesData?.services?.find(
          (s) => s.id === order.serviceId,
        );

        track('order_created', {
          order_id: order.id,
          order_invoice_id: order.invoiceId,
          order_name: order.name,
          order_status: order.status,
          order_collection_method: order.method?.[0],
          service_id: order.serviceId,
          service_name: order.serviceName,
          is_blood_panel: isBloodPanel(order.serviceName),
          value: service?.price,
          currency: 'USD',
        });
      });
      queryClient.invalidateQueries({
        queryKey: getOrdersQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getServicesQueryOptions().queryKey,
      });
      // https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation#query-matching-with-invalidatequeries
      // we want to invalidate ALL service queries here
      queryClient.invalidateQueries({
        queryKey: ['service'],
      });
      onSuccess?.(response, variables, context);
    },
    ...restConfig,
    mutationFn: createBulkOrders,
  });
};
