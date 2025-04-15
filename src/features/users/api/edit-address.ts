import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { getServicesQueryOptions } from '@/features/services/api';
import { api } from '@/lib/api-client';
import { useUser } from '@/lib/auth';
import { MutationConfig } from '@/lib/react-query';
import { User } from '@/types/api';

import { addressInputSchema } from './create-address';

/**
 * Used as main type for all form inputs where we need to add/update address
 */
export const formAddressInputSchema = z.object({
  line1: z
    .string()
    .min(3, { message: 'Please enter a valid address.' })
    .regex(/^[a-zA-Z0-9 .-]+$/, {
      message: `Address Line 1 has invalid characters`,
    }),
  line2: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined || val.trim() === '' || /^[a-zA-Z0-9 .-]+$/.test(val),
      {
        message: `Address Line 2 has invalid characters`,
      },
    ),
  postalCode: z.string().min(5, { message: 'Please enter a valid zip code.' }),
  city: z.string().min(1, { message: 'Please enter a city.' }),
  state: z.string().min(2, { message: 'Please enter a state.' }),
  text: z.string().optional(),
});

export type FormAddressInput = z.infer<typeof formAddressInputSchema>;

/**
 * Used as internal type to prepare object for server
 */
const activeAddressInputSchema = z.object({
  address: addressInputSchema,
  id: z.string().optional(),
});

/**
 * NOTE: this is bad and we should really just pass id and address values to update
 * but since its big pain to change it everywhere on server
 * we stick to previous approach
 */
const editAddressInputSchema = z.object({
  primaryAddressId: z.string().optional(),
  activeAddress: activeAddressInputSchema.optional(),
});

export type EditAddressInput = z.infer<typeof editAddressInputSchema>;

export const editAddress = ({
  data,
}: {
  data: EditAddressInput;
}): Promise<User> => {
  return api.put(`/users/address`, data);
};

type UseEditAddressOptions = {
  mutationConfig?: MutationConfig<typeof editAddress>;
};

export const useEditAddress = ({
  mutationConfig,
}: UseEditAddressOptions = {}) => {
  const { refetch: refetchUser } = useUser();
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchUser();

      queryClient.refetchQueries({
        queryKey: getServicesQueryOptions().queryKey,
      });

      queryClient.refetchQueries({
        queryKey: ['service'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: editAddress,
  });
};
