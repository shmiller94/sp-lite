import { createFileRoute, Navigate } from '@tanstack/react-router';

import { Head } from '@/components/seo';
import { Spinner } from '@/components/ui/spinner';
import { useRevealLatest } from '@/features/protocol/api/reveal';
import { getInitialStepForPhase } from '@/features/protocol/components/reveal/protocol-stepper';

export const Route = createFileRoute('/_app/protocol/reveal/')({
  component: ProtocolRevealIndexComponent,
});

function ProtocolRevealIndexComponent() {
  const { data: revealData, isLoading } = useRevealLatest();

  if (isLoading) {
    return (
      <>
        <Head title="Protocol Reveal" />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner variant="primary" />
        </div>
      </>
    );
  }

  const lastCompletedPhase = revealData?.lastCompletedPhase ?? 'not_started';

  if (lastCompletedPhase === 'completed') {
    return <Navigate to="/protocol" replace />;
  }

  const initialStep = getInitialStepForPhase(lastCompletedPhase);

  return (
    <Navigate
      to="/protocol/reveal/$step"
      params={{ step: initialStep }}
      replace
    />
  );
}
