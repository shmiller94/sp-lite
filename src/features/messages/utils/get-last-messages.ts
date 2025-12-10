import { ChatMessage, ChatMessagePart } from '@/types/api';

export function getLastMessageByRole(
  messages: ChatMessage[] | undefined | null,
  role: 'user' | 'assistant',
): string | null {
  if (!messages || messages.length === 0) return null;
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role === role) {
      const part = m.parts.find((p) => p.type === 'text') as
        | ChatMessagePart
        | undefined;
      if (part && part.text && part.text.trim()) return part.text;
    }
  }
  return null;
}

export function getLastUserMessage(
  messages: ChatMessage[] | undefined | null,
): string | null {
  return getLastMessageByRole(messages, 'user');
}

export function getLastAiMessage(
  messages: ChatMessage[] | undefined | null,
): string | null {
  return getLastMessageByRole(messages, 'assistant');
}
