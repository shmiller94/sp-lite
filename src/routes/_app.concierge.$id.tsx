import { createFileRoute } from '@tanstack/react-router';
import { UIMessage } from 'ai';

import { useMessages } from '@/features/messages/api/get-messages';
import { Chat } from '@/features/messages/components/ai/chat';

export const Route = createFileRoute('/_app/concierge/$id')({
  component: ConciergeIdComponent,
});

function ConciergeIdComponent() {
  const { id } = Route.useParams();

  const getMessagesQuery = useMessages({
    chatId: id,
    queryConfig: {
      enabled: true,
    },
  });

  if (getMessagesQuery.isFetching && !getMessagesQuery.data) {
    return <div className="w-full" />;
  }

  let initialMessages: Array<UIMessage> = [];

  if (getMessagesQuery.data) {
    initialMessages = getMessagesQuery.data;
  }

  return <Chat key={id} id={id} initialMessages={initialMessages} />;
}
