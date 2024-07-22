import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Message } from '@/types/api';

export const createMessageInputSchema = z.object({
  body: z.string().min(1, 'Required'),
});

export type CreateMessageInput = z.infer<typeof createMessageInputSchema>;

export const createMessage = ({
  data,
}: {
  data: CreateMessageInput;
}): Promise<Message> => {
  return api.post(`/messages`, data);
};

type UseCreateMessageOptions = {
  mutationConfig?: MutationConfig<typeof createMessage>;
};

export const useCreateMessage = ({
  mutationConfig,
}: UseCreateMessageOptions = {}) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createMessage,
  });
};
