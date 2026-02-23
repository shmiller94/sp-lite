import { createFileRoute } from '@tanstack/react-router';

import { Head } from '@/components/seo/head';
import { ProtocolGoalView } from '@/features/protocol/components/goals/protocol-goal-view';

export const Route = createFileRoute(
  '/_app/protocol/plans/$planId/goals/$goalId',
)({
  component: ProtocolGoalComponent,
});

function ProtocolGoalComponent() {
  const { planId, goalId } = Route.useParams();

  return (
    <>
      <Head title="Goal" />
      <ProtocolGoalView protocolId={planId} goalId={goalId} />
    </>
  );
}
