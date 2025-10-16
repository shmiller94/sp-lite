import { useChat } from '@ai-sdk/react';
import { DataUIPart, DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

import { env } from '@/config/env';
import { getFollowupString } from '@/features/messages/utils/data-parts';
import { getActiveLogin } from '@/lib/utils';

export function useSuggestions({
  enabled,
  max = 3,
}: {
  enabled: boolean;
  max: number;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const startedRef = useRef(false);
  const countRef = useRef(0);

  const updateSuggestions = (entries: string | string[]) => {
    const items = Array.isArray(entries) ? entries : [entries];
    setSuggestions((prev) => {
      const next = [...new Set([...prev, ...items])].slice(0, max);
      countRef.current = next.length;
      return next;
    });
  };

  const clearSuggestions = () => {
    countRef.current = 0;
    setSuggestions([]);
  };

  const { sendMessage, stop } = useChat({
    transport: new DefaultChatTransport({
      api: `${env.API_URL}/chat`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${getActiveLogin()?.accessToken}`,
      },
      prepareSendMessagesRequest({ messages }) {
        return {
          body: {
            message: messages[messages.length - 1],
            id: null,
          },
        };
      },
    }),
    dataPartSchemas: { followup: z.string() },
    messages: [],
    onData: (part: DataUIPart<Record<string, unknown>>) => {
      const s = getFollowupString(part);
      if (s) {
        updateSuggestions(s);
        if (countRef.current >= max) stop();
      }
    },
  });

  useEffect(() => {
    if (!enabled) return;
    if (suggestions.length > 0) return;
    if (startedRef.current) return;
    startedRef.current = true;

    // seed empty user message
    sendMessage({
      role: 'user',
      parts: [
        {
          type: 'text',
          text: '',
        },
      ],
    });

    return () => {
      stop();
      startedRef.current = false;
    };
  }, [enabled, max, sendMessage, stop]);

  return { suggestions, updateSuggestions, clearSuggestions };
}
