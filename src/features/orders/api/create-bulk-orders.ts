import { useMutation, useQueryClient } from '@tanstack/react-query';

import { checkLabOrderSupport } from '@/const';
import { getTimelineQueryOptions } from '@/features/homepage/api/get-timeline';
import { CreateOrderInput } from '@/features/orders/api/create-order';
import { getOrdersQueryOptions } from '@/features/orders/api/get-orders';
import { getServices, getServicesQueryOptions } from '@/features/services/api';
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

  return useMutation({
    onSuccess: async (response, variables, context) => {
      // Track order events for each order in the bulk creation
      const orders = response.orders;

      queryClient.invalidateQueries({
        queryKey: getTimelineQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getOrdersQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getServicesQueryOptions().queryKey,
      });
      onSuccess?.(response, variables, context);

      // simple api call to just get data, TODO: we can likely grab it from query client cache as well
      const data = await getServices({});
      orders.forEach((order) => {
        const service = data?.services?.find((s) => s.id === order.serviceId);

        track('order_created', {
          order_id: order.id,
          order_name: order.serviceName,
          order_status: order.status,
          order_collection_method: order.collectionMethod,
          service_id: order.serviceId,
          service_name: order.serviceName,
          is_blood_panel: checkLabOrderSupport(order.serviceName),
          value: service?.price,
          currency: 'USD',
        });
      });
    },
    ...restConfig,
    mutationFn: createBulkOrders,
  });
};
