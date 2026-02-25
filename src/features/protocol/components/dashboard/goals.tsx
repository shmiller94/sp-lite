import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

import { Body1, H4 } from '@/components/ui/typography';
import { useAnalytics } from '@/hooks/use-analytics';

import type { ProtocolGoal } from '../../api';
import { ProtocolIndexNumber } from '../protocol-index-number';

interface GoalsProps {
  goals: ProtocolGoal[];
  protocolId: string;
}

export const Goals = ({ goals, protocolId }: GoalsProps) => {
  const { track } = useAnalytics();
  const displayedGoals = goals.slice(0, 3);

  return (
    <div className="space-y-4">
      <H4>What we are working on</H4>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {displayedGoals.map((goal, index) => (
          <Link
            key={goal.id}
            to="/protocol/plans/$planId/goals/$goalId"
            params={{ planId: protocolId, goalId: goal.id }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow shadow-black/[.03] outline-none transition-all hover:border-zinc-300 hover:shadow-md md:min-h-48 md:p-5"
            onClick={() =>
              track('protocol_dashboard_goal_clicked', {
                goal_id: goal.id,
                goal_title: goal.title,
                goal_index: index,
              })
            }
          >
            <div className="flex items-center justify-between md:items-start">
              <ProtocolIndexNumber
                index={index}
                className="text-left text-4xl md:text-5xl"
              />
              <ChevronRight className="absolute right-2 top-1/2 size-5 -translate-y-1/2 text-zinc-400 transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-zinc-500 md:static md:mt-4" />
            </div>

            <div>
              <Body1 className="font-medium leading-tight">{goal.title}</Body1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
