import { PaymentMethod } from '@stripe/stripe-js';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

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
    queryFn: () => getPaymentMethods(page),
  });
};

type UsePaymentMethodsOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getPaymentMethodsQueryOptions>;
};

export const usePaymentMethods = ({
  queryConfig,
  page,
}: UsePaymentMethodsOptions) => {
  return useQuery({
    ...getPaymentMethodsQueryOptions({ page }),
    ...queryConfig,
  });
};
