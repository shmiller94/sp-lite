import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { getTimelineQueryOptions } from '@/features/home/api/get-timeline';
import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const completeOrderInputSchema = z.object({
  fileId: z.string().min(1),
});

export type CompleteOrderInput = z.infer<typeof completeOrderInputSchema>;

export const completeOrder = ({
  orderId,
  data,
}: {
  orderId: string;
  data: CompleteOrderInput;
}) => {
  return api.post(`/orders/${orderId}/complete`, { data });
};

type UseCompleteOrderOptions = {
  mutationConfig?: MutationConfig<typeof completeOrder>;
};

export const useCompleteOrder = ({
  mutationConfig,
}: UseCompleteOrderOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getTimelineQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: completeOrder,
  });
};
