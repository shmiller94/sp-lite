import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { CheckoutLineItem, Product } from '@/types/api';

export const createCheckoutUrl = ({
  data,
}: {
  data: Product[];
}): Promise<{ checkoutUrl: string }> => {
  const lineItems: CheckoutLineItem[] = data.map((checkoutItem) => ({
    productVariantId: checkoutItem.id,
    quantity: 1,
  }));
  return api.post('/shop/checkout', { lineItems });
};

type UseCreateCheckoutUrlOptions = {
  mutationConfig?: MutationConfig<typeof createCheckoutUrl>;
};

export const useCreateCheckoutUrl = ({
  mutationConfig,
}: UseCreateCheckoutUrlOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createCheckoutUrl,
  });
};
