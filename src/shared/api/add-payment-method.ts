import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { getPaymentMethodsQueryOptions } from '@/shared/api/get-payment-methods';

export const addPaymentMethodInputSchema = z.object({
  paymentMethodId: z.string().min(1),
});

export type AddPaymentMethodInput = z.infer<typeof addPaymentMethodInputSchema>;

export const addPaymentMethod = ({
  data,
}: {
  data: AddPaymentMethodInput;
}): Promise<{ success: boolean }> => {
  const { paymentMethodId } = data;

  return api.post(`billing/methods/${paymentMethodId}`, {
    paymentMethodId,
  });
};

type UseAddPaymentMethodOptions = {
  mutationConfig?: MutationConfig<typeof addPaymentMethod>;
};

export const useAddPaymentMethod = ({
  mutationConfig,
}: UseAddPaymentMethodOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getPaymentMethodsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: addPaymentMethod,
  });
};
