import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { z } from 'zod';

import { getTimelineQueryOptions } from '@/features/home/api/get-timeline';
import { getOrdersQueryOptions } from '@/features/orders/api/get-orders';
import { getServicesQueryOptions } from '@/features/services/api';
import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Order } from '@/types/api';

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
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: upgradeOrder,
    onSuccess: (...args) => {
      if (shouldResyncImmediately)
        resyncDataAfterUpgradedOrder({ queryClient });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
