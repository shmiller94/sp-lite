import { UseChatHelpers } from '@ai-sdk/react';
import { FileUIPart, UIMessage } from 'ai';
import { useCallback, useEffect, useState } from 'react';

export interface QueuedMessage {
  id: string;
  text: string;
  files: FileUIPart[];
}

export function useMessageQueue({
  status,
  onSend,
}: {
  status: UseChatHelpers<UIMessage>['status'];
  onSend: (msg: { text: string; files: FileUIPart[] }) => void;
}) {
  const [queue, setQueue] = useState<QueuedMessage[]>([]);

  const enqueue = useCallback((msg: { text: string; files: FileUIPart[] }) => {
    setQueue((prev) => [...prev, { id: crypto.randomUUID(), ...msg }]);
  }, []);

  useEffect(() => {
    if (status !== 'ready' || queue.length === 0) return;

    const [next, ...rest] = queue;
    setQueue(rest);

    onSend({ text: next.text, files: next.files });
  }, [status, queue, onSend]);

  const remove = useCallback((id: string) => {
    setQueue((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  return { queue, enqueue, remove };
}
