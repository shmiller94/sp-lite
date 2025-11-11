import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { PaymentMethod } from '@/types/api';

export const getPaymentMethods = (
  page = 1,
): Promise<{
  defaultPaymentMethod: string;
  paymentMethods: PaymentMethod[];
}> => {
  return api.get('billing/methods', {
    params: {
      page,
    },
  });
};

export const getPaymentMethodsQueryOptions = ({
  page,
}: { page?: number } = {}) => {
  return queryOptions({
    queryKey: page ? ['paymentMethods', { page }] : ['paymentMethods'],
    queryFn: async () => {
      const response = await getPaymentMethods(page);
      return {
        ...response,
        paymentMethods: response.paymentMethods.map((pm: PaymentMethod) => ({
          ...pm,
          type: (pm.type ?? 'card') as 'card' | 'klarna' | 'link',
        })),
      };
    },
  });
};

type UsePaymentMethodsOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getPaymentMethodsQueryOptions>;
};

export const usePaymentMethods = ({
  queryConfig,
  page,
}: UsePaymentMethodsOptions = {}) => {
  return useQuery({
    ...getPaymentMethodsQueryOptions({ page }),
    ...queryConfig,
  });
};
