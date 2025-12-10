import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getHistoryQueryOptions } from '@/features/messages/api/get-history';
import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Visibility } from '@/types/api';

export const updateChat = async ({
  chatId,
  data,
}: {
  chatId: string;
  data: { title?: string; visibility?: Visibility };
}) => {
  return api.post(`/chat/${chatId}`, data);
};

type UseUpdateChatOptions = {
  mutationConfig?: MutationConfig<typeof updateChat>;
};

export const useUpdateChat = ({
  mutationConfig,
}: UseUpdateChatOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getHistoryQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateChat,
  });
};
