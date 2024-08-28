import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useStepper } from '@/components/ui/stepper';
import { H1, H4 } from '@/components/ui/typography';
import { EntryLayout } from '@/features/onboarding/components/layouts';

export const ActivateBookingEntry = () => {
  const { nextStep } = useStepper((s) => s);
  return (
    <section
      id="main"
      className="mx-auto flex max-w-[630px] flex-col gap-y-12 text-center"
    >
      <div className="space-y-6">
        <H4 className="text-white">Thank you, Jonah</H4>
        <H1 className="text-white">Let’s activate your experience</H1>
      </div>
      <Button
        className="mx-auto flex flex-row items-center justify-center gap-1 rounded-[50px] bg-white p-4 text-zinc-900 hover:bg-white/90"
        onClick={nextStep}
      >
        Activate
        <ChevronRight className="size-4" />
      </Button>
    </section>
  );
};

export const ActivateBookingEntryStep = () => (
  <EntryLayout
    type="default"
    title="Activate Booking"
    className="bg-female-spine"
  >
    <ActivateBookingEntry />
  </EntryLayout>
);
