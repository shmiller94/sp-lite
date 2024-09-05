import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { getPlansQueryOptions } from '@/features/action-plan/api/get-plans';
import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Plan } from '@/types/api';

export const createPlanInputSchema = z.object({
  orderId: z.string().min(1, 'Required'),
  title: z.string().optional(),
  description: z.string().optional(),
  published: z.boolean(),
  goals: z.array(z.any()),
});

export type CreatePlanInput = z.infer<typeof createPlanInputSchema>;

export const createPlan = ({
  data,
}: {
  data: CreatePlanInput;
}): Promise<{ actionPlan: Plan }> => {
  return api.post('/plans', data);
};

type UseCreatePlanOptions = {
  mutationConfig?: MutationConfig<typeof createPlan>;
};

export const useCreatePlan = ({
  mutationConfig,
}: UseCreatePlanOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getPlansQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createPlan,
  });
};
