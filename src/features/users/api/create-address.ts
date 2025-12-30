import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getMarketplaceQueryOptions } from '@/features/marketplace/api/get-marketplace';
import { api } from '@/lib/api-client';
import { useUser } from '@/lib/auth';
import { MutationConfig } from '@/lib/react-query';
import { AddressInput } from '@/types/address';
import { User } from '@/types/api';

export const createAddress = ({
  data,
}: {
  data: AddressInput;
}): Promise<User> => {
  return api.post(`/users/address`, data);
};

type UseCreateAddressOptions = {
  mutationConfig?: MutationConfig<typeof createAddress>;
};

export const useCreateAddress = ({
  mutationConfig,
}: UseCreateAddressOptions = {}) => {
  const { refetch: refetchUser } = useUser();
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchUser();

      // Invalidate marketplace products query when a new address is created
      // This is important because if the new address is set as primary (use: 'home'),
      // the available products may change based on the address location
      queryClient.invalidateQueries({
        queryKey: getMarketplaceQueryOptions().queryKey,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createAddress,
  });
};
