import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { useUser } from '@/lib/auth';
import { MutationConfig } from '@/lib/react-query';
import { User } from '@/types/api';

export const addressInputSchema = z.object({
  line: z.array(z.string()),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  postalCode: z.string().min(5, 'Required'),
});

const createAddressInputSchema = z.object({
  address: addressInputSchema,
});

export type CreateAddressInput = z.infer<typeof createAddressInputSchema>;

export const createAddress = ({
  data,
}: {
  data: CreateAddressInput;
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

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchUser();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createAddress,
  });
};
