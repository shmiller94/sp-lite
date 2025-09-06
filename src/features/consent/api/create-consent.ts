import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const createConsentInputSchema = z.object({
  agreedAt: z.string().min(1, 'This is required.'),
  metadata: z.record(z.any()).optional(),
});

export type CreateConsentInput = z.infer<typeof createConsentInputSchema>;

export const createConsent = ({
  data,
}: {
  data: CreateConsentInput;
}): Promise<{ consent: { id: string; agreedAt: string } }> => {
  return api.post('/consent', data);
};

type UseCreateConsentOptions = {
  mutationConfig?: MutationConfig<typeof createConsent>;
};

export const useCreateConsent = ({
  mutationConfig,
}: UseCreateConsentOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      // Invalidate any consent-related queries if they exist in the future
      queryClient.invalidateQueries({
        queryKey: ['consent'],
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createConsent,
  });
};
