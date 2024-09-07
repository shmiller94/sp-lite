import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { H1, H4 } from '@/components/ui/typography';
import { EntryLayout } from '@/features/onboarding/components/layouts';
import { useStepper } from '@/lib/stepper';

export const TypeformEntry = () => {
  const { nextOnboardingStep } = useStepper((s) => s);
  return (
    <section
      id="main"
      className="mx-auto flex max-w-[723px] flex-col gap-y-12 text-center"
    >
      <div className="space-y-6">
        <H4 className="text-white">And finally, the most important step</H4>
        <H1 className="text-white">Complete your health journey survey</H1>
      </div>
      <Button
        className="mx-auto flex flex-row items-center justify-center gap-1 rounded-[50px] bg-white p-4 text-zinc-900 hover:bg-white/90"
        onClick={nextOnboardingStep}
      >
        Get started
        <ChevronRight className="size-4" />
      </Button>
    </section>
  );
};

export const TypeformEntryStep = () => (
  <EntryLayout
    title="Typeform"
    type="action-header"
    className="bg-female-spotlight"
    bottomBlockTxt="This step is required in order to access the Superpower platform and fully activate your membership"
  >
    <TypeformEntry />
  </EntryLayout>
);
