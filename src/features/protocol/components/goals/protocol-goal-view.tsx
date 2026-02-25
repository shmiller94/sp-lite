import { Skeleton } from '@/components/ui/skeleton';
import { Body1 } from '@/components/ui/typography';

import { useLatestProtocol, useProtocol } from '../../api';
import { getGoalIndex } from '../../utils/get-goal-index';

import { GoalDetailPage } from './goal-detail-page';

type ProtocolGoalViewProps = {
  protocolId: string;
  goalId: string;
};

/**
 * View for a specific goal in a protocol
 * Path: /protocol/plans/:planId/goals/:goalId
 */
export function ProtocolGoalView({
  protocolId,
  goalId,
}: ProtocolGoalViewProps) {
  const { data: latestData, isLoading: isLatestProtocolLoading } =
    useLatestProtocol();
  const { data: protocolData, isLoading, error } = useProtocol(protocolId);

  // Unwrap the protocol from the response
  const lastProtocol = latestData?.protocol;
  const protocol = protocolData?.protocol;

  const isLatestProtocol = lastProtocol?.id === protocolId;

  if (isLoading || isLatestProtocolLoading) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6 p-6 lg:px-0">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <div className="flex items-start gap-4">
          <Skeleton className="size-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/3 rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !protocol) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <Body1 className="text-red-600">
          Failed to load goal. Please try again later.
        </Body1>
      </div>
    );
  }

  const goal = protocol.goals.find((g) => g.id === goalId);
  const goalIndex = getGoalIndex(protocol.goals, goalId);

  if (!goal) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <Body1 className="text-red-600">Goal not found.</Body1>
      </div>
    );
  }

  const protocolLink = isLatestProtocol
    ? '/protocol'
    : `/protocol/plans/${protocolId}`;

  return (
    <GoalDetailPage
      goal={goal}
      goalIndex={goalIndex}
      protocolId={protocolId}
      backLink={protocolLink}
    />
  );
}
