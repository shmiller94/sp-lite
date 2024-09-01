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

export type AddressInput = z.infer<typeof addressInputSchema>;

export const primaryAddressInputSchema = z.object({
  address: addressInputSchema,
  id: z.string().optional(),
});

export type PrimaryAddressInput = z.infer<typeof primaryAddressInputSchema>;

export const activeAddressInputSchema = z.object({
  address: addressInputSchema,
  id: z.string().optional(),
});

export type ActiveAddressInput = z.infer<typeof activeAddressInputSchema>;

export const updateProfileInputSchema = z.object({
  primaryAddress: primaryAddressInputSchema.optional(),
  activeAddress: activeAddressInputSchema.optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;

export const updateProfile = ({
  data,
}: {
  data: UpdateProfileInput;
}): Promise<User> => {
  return api.put(`/users`, data);
};

type UseUpdateProfileOptions = {
  mutationConfig?: MutationConfig<typeof updateProfile>;
};

export const useUpdateProfile = ({
  mutationConfig,
}: UseUpdateProfileOptions = {}) => {
  const { refetch: refetchUser } = useUser();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchUser();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateProfile,
  });
};
