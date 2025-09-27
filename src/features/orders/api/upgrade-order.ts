import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { z } from 'zod';

import { isBloodPanel } from '@/const/services';
import { getTimelineQueryOptions } from '@/features/home/api/get-timeline';
import { getOrdersQueryOptions } from '@/features/orders/api/get-orders';
import { getServicesQueryOptions } from '@/features/services/api';
import { useAnalytics } from '@/hooks/use-analytics';
import { api } from '@/lib/api-client';
import { useUser } from '@/lib/auth';
import { MutationConfig } from '@/lib/react-query';
import { Order } from '@/types/api';
import { getUpgradePrice } from '@/utils/get-upgrade-price';

export const upgradeOrderInputSchema = z.object({
  upgradeType: z.enum(['advanced']),
});

export type UpgradeOrderInput = z.infer<typeof upgradeOrderInputSchema>;

export const upgradeOrder = ({
  data,
}: {
  data: UpgradeOrderInput;
}): Promise<{ order: Order }> => {
  return api.post(`/orders/upgrade`, data);
};

export const resyncDataAfterUpgradedOrder = ({
  queryClient,
}: {
  queryClient: QueryClient;
}) => {
  queryClient.invalidateQueries({
    queryKey: getOrdersQueryOptions().queryKey,
  });
  queryClient.invalidateQueries({
    queryKey: getTimelineQueryOptions().queryKey,
  });
  queryClient.invalidateQueries({
    queryKey: getServicesQueryOptions().queryKey,
  });
  queryClient.invalidateQueries({
    queryKey: ['service'],
  });
};

type UseUpgradeOrderOptions = {
  shouldResyncImmediately?: boolean;
  mutationConfig?: MutationConfig<typeof upgradeOrder>;
};

export const useUpgradeOrder = (
  { mutationConfig, shouldResyncImmediately }: UseUpgradeOrderOptions = {
    shouldResyncImmediately: true,
  },
) => {
  const queryClient = useQueryClient();
  const { track } = useAnalytics();
  const { data: user } = useUser();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: upgradeOrder,
    onSuccess: (response, variables, context) => {
      // Track upgrade order events
      const order = response.order;

      track('order_upgraded', {
        order_id: order.id,
        order_invoice_id: order.invoiceId,
        order_name: order.name,
        order_status: order.status,
        order_collection_method: order.method?.[0],
        service_id: order.serviceId,
        service_name: order.serviceName,
        is_blood_panel: isBloodPanel(order.serviceName),
        value: getUpgradePrice(user),
        currency: 'USD',
        order,
      });

      if (shouldResyncImmediately)
        resyncDataAfterUpgradedOrder({ queryClient });

      onSuccess?.(response, variables, context);
    },
    ...restConfig,
  });
};
