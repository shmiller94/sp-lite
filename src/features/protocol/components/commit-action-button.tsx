import { AnimatePresence, m } from 'framer-motion';
import { Check, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { ProtocolAction } from '@/features/protocol/api/protocol';
import {
  useRevealBuilderStore,
  type CommittedAction,
} from '@/features/protocol/stores/reveal-builder-store';
import { useAnalytics } from '@/hooks/use-analytics';
import { cn } from '@/lib/utils';

interface CommitActionButtonProps {
  action?: ProtocolAction;
  goalId?: string;
  onClick?: () => void;
  className?: string;
}

export const CommitActionButton = ({
  action,
  goalId,
  onClick,
  className,
}: CommitActionButtonProps) => {
  const { commitAction, uncommitAction, committedActions } =
    useRevealBuilderStore();
  const { track } = useAnalytics();

  const isCommitted = action ? action.id in committedActions : false;

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (action && goalId) {
      if (isCommitted) {
        uncommitAction(action.id);
        track('protocol_reveal_action_uncommitted', {
          action_id: action.id,
          action_type: action.content.type,
          action_title: action.title,
          goal_id: goalId,
        });
      } else {
        const committedAction: CommittedAction = {
          id: action.id,
          type: action.content.type,
          data: action,
          goalId,
        };
        commitAction(committedAction);
        track('protocol_reveal_action_committed', {
          action_id: action.id,
          action_type: action.content.type,
          action_title: action.title,
          goal_id: goalId,
        });
      }
    }
  };

  return (
    <m.div
      className="ml-auto w-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      layout
      whileTap={{ scale: 0.98 }}
      transition={{
        layout: { type: 'spring', stiffness: 400, damping: 30 },
        scale: { type: 'spring', stiffness: 400, damping: 25 },
        opacity: { duration: 0.2 },
      }}
    >
      <Button
        size="small"
        className={cn(
          'w-auto gap-2 overflow-hidden rounded-full',
          isCommitted
            ? '!bg-transparent text-vermillion-900 shadow-none'
            : 'bg-vermillion-900 hover:bg-orange-600',
          className,
        )}
        onClick={handleClick}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isCommitted ? (
            <m.span
              key="committed"
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <span>Action added</span>
              <m.span
                className="flex size-6 items-center justify-center rounded-full bg-vermillion-900"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 20,
                  delay: 0.05,
                }}
              >
                <Check className="size-4 text-white" strokeWidth={2.5} />
              </m.span>
            </m.span>
          ) : (
            <m.span
              key="not-committed"
              className="flex items-center gap-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <m.span
                initial={{ rotate: -45, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 20,
                  delay: 0.05,
                }}
              >
                <Plus className="size-4" />
              </m.span>
              <span>Add</span>
            </m.span>
          )}
        </AnimatePresence>
      </Button>
    </m.div>
  );
};
