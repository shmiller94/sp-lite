import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getOrdersQueryOptions } from '@/features/orders/api/get-orders';
import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const cancelOrder = ({ orderId }: { orderId: string }) => {
  return api.post(`/orders/${orderId}/cancel`);
};

type UseCancelOrderOptions = {
  mutationConfig?: MutationConfig<typeof cancelOrder>;
};

export const useCancelOrder = ({
  mutationConfig,
}: UseCancelOrderOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getOrdersQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: cancelOrder,
  });
};
