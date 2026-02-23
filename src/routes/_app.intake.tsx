import { createFileRoute } from '@tanstack/react-router';

import { Spinner } from '@/components/ui/spinner';
import { IntakeStepRenderer } from '@/features/intake/components/step-renderer';
import { useIntakeFlow } from '@/features/intake/hooks/use-intake-flow';

export const Route = createFileRoute('/_app/intake')({
  component: IntakeComponent,
});

function IntakeComponent() {
  const { isLoading, isInitialized } = useIntakeFlow();

  if (isLoading || !isInitialized) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center">
        <Spinner variant="primary" />
      </div>
    );
  }

  return <IntakeStepRenderer />;
}
