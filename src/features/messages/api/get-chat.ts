import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Chat } from '@/types/api';

export const getChat = async ({
  chatId,
}: {
  chatId: string;
}): Promise<Chat> => {
  return api.get(`/chat/${chatId}`);
};

export const getChatQueryOptions = (chatId: string) => {
  return queryOptions({
    queryKey: ['chatInfo', chatId],
    queryFn: () => getChat({ chatId }),
  });
};

type UseChatOptions = {
  queryConfig?: QueryConfig<typeof getChatQueryOptions>;
  chatId: string;
};

export const useChat = ({ queryConfig, chatId }: UseChatOptions) => {
  return useQuery({
    ...getChatQueryOptions(chatId),
    ...queryConfig,
  });
};
