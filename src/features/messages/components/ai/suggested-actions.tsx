import { Dispatch, memo, SetStateAction } from 'react';

import { useCreateFollowups } from '@/features/messages/api/create-followups';
import { ChatSuggestion } from '@/features/messages/components/chat-suggestion';

interface SuggestedActionsProps {
  setInput: Dispatch<SetStateAction<string>>;
}

const SUGGESTIONS_COUNT = 3;

function PureSuggestedActions({ setInput }: SuggestedActionsProps) {
  const ctx = `I'm exploring the Superpower app. Suggest ${SUGGESTIONS_COUNT} short follow-up questions I can ask the AI.`;
  const { data: suggestions = [] } = useCreateFollowups({
    context: ctx,
    count: SUGGESTIONS_COUNT,
    enabled: true,
  });

  return (
    <div className="flex min-h-10 w-full flex-row flex-wrap items-start justify-start gap-2 lg:items-start lg:justify-center">
      {suggestions.slice(0, 3).map((s, index) => (
        <ChatSuggestion
          key={`suggested-action-${s}-${index}`}
          className="shrink-0"
          suggestion={s}
          onClick={(e) => {
            e.preventDefault();
            setInput(s);
          }}
        />
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions);
