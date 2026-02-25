import { Body2, H4 } from '@/components/ui/typography';

import type { ProtocolAction } from '../../api';

import { TodoItem } from './todo-item';

interface TodaysListProps {
  actions: ProtocolAction[];
}

export const TodaysList = ({ actions }: TodaysListProps) => {
  return (
    <div className="space-y-2">
      <H4>Today&apos;s actions</H4>

      {actions.length > 0 ? (
        <div className="space-y-0">
          {actions.map((action, index) => {
            const isFirstItem = index === 0;
            const isLastItem = index === actions.length - 1;

            return (
              <TodoItem
                key={`${action.content.type}-${index}`}
                action={action}
                isFirstItem={isFirstItem}
                isLastItem={isLastItem}
                index={index}
              />
            );
          })}
        </div>
      ) : (
        <Body2 className="text-secondary">No actions for today.</Body2>
      )}
    </div>
  );
};
