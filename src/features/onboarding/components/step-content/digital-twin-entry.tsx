import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { H1 } from '@/components/ui/typography';
import { EntryLayout } from '@/features/onboarding/components/layouts';
import { useStepper } from '@/lib/stepper';

export const DigitalTwinEntry = () => {
  const { nextOnboardingStep, updatingStep } = useStepper((s) => s);
  return (
    <section
      id="main"
      className="mx-auto flex max-w-[523px] flex-col gap-y-12 text-center"
    >
      <H1 className="text-white">It’s time to build your digital twin</H1>
      <Button
        className="mx-auto flex flex-row items-center justify-center gap-1 rounded-[50px] bg-white p-4 text-zinc-900 hover:bg-white/90"
        onClick={nextOnboardingStep}
      >
        {updatingStep ? (
          <Spinner />
        ) : (
          <>
            Set up
            <ChevronRight className="size-4" />
          </>
        )}
      </Button>
    </section>
  );
};

export const DigitalTwinEntryStep = () => (
  <EntryLayout
    title="Digital Twin"
    type="time-footer"
    className="bg-female-spotlight"
  >
    <DigitalTwinEntry />
  </EntryLayout>
);
