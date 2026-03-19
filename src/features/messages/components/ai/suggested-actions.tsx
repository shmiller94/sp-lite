import { ChevronRight } from 'lucide-react';
import { memo } from 'react';

import { Body2 } from '@/components/ui/typography';
import { useCreateFollowups } from '@/features/messages/api/create-followups';
import { ChatSuggestion } from '@/features/messages/components/chat-suggestion';
import { cn } from '@/lib/utils';

interface SetupAction {
  title: string;
  subtitle: string;
  imageSrc: string;
  onClick: () => void;
}

interface SuggestedActionsProps {
  onSendSuggestion: (text: string) => void;
  setupActions?: SetupAction[];
}

const SUGGESTIONS_COUNT = 3;

function PureSuggestedActions({
  onSendSuggestion,
  setupActions,
}: SuggestedActionsProps) {
  const ctx = `I'm exploring the Superpower app. Suggest ${SUGGESTIONS_COUNT} short follow-up questions I can ask the AI.`;
  const { data: suggestions = [] } = useCreateFollowups({
    context: ctx,
    count: SUGGESTIONS_COUNT,
    enabled: true,
  });

  return (
    <div className="flex w-full flex-col items-center gap-2.5">
      <div className="flex flex-row flex-wrap justify-center gap-2.5">
        {suggestions.slice(0, 3).map((s) => (
          <ChatSuggestion
            key={s}
            className="shrink-0"
            suggestion={s}
            onClick={(e) => {
              e.preventDefault();
              onSendSuggestion(s);
            }}
          />
        ))}
      </div>
      {setupActions?.map((action) => (
        <button
          key={action.title}
          type="button"
          onClick={action.onClick}
          className={cn(
            'group flex w-full max-w-[548px] items-center justify-between gap-3 rounded-2xl border border-zinc-200 px-4 py-2 text-left shadow-lg shadow-black/5 outline-none transition-colors duration-300 animate-in fade-in slide-in-from-bottom-2 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-ring',
          )}
        >
          <div>
            <div className="flex items-center gap-1">
              <Body2 className="text-balance p-0 text-secondary transition-all duration-200 group-hover:text-zinc-700">
                {action.title}
              </Body2>
              <ChevronRight
                size={14}
                aria-hidden="true"
                className="text-zinc-400 transition-transform group-hover:translate-x-0.5"
              />
            </div>
            <Body2 className="p-0 text-zinc-400">{action.subtitle}</Body2>
          </div>
          <div className="p-1.5 transition-transform duration-200 group-hover:-translate-y-0.5">
            <img
              src={action.imageSrc}
              alt=""
              className="h-10 w-auto shrink-0 object-contain"
            />
          </div>
        </button>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions);
