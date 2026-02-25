import { createFileRoute } from '@tanstack/react-router';

import { Head } from '@/components/seo/head';
import { LegacyProtocolGoalView } from '@/features/protocol/components/goals/legacy/protocol-goal-view';

export const Route = createFileRoute(
  '/_app/protocol/legacy/$planId/goals/$goalId',
)({
  component: LegacyProtocolGoalComponent,
});

function LegacyProtocolGoalComponent() {
  const { planId, goalId } = Route.useParams();

  return (
    <>
      <Head title="Goal" />
      <LegacyProtocolGoalView protocolId={planId} goalId={goalId} />
    </>
  );
}
