import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CheckoutStep } from '@/features/action-plan/components/steps/checkout-step';
import { ReviewStep } from '@/features/action-plan/components/steps/review-step';
import { CheckoutStoreProvider } from '@/features/action-plan/stores/checkout-store';
import { StepItem, StepperStoreProvider, useStepper } from '@/lib/stepper';
import { Plan } from '@/types/api';
import { capitalize } from '@/utils/format';

export function ActionPlanCheckoutModal({
  actionPlan,
}: {
  actionPlan: Plan | null;
}) {
  if (!actionPlan) {
    return null;
  }

  const steps: StepItem[] = [
    {
      id: 'review',
      content: <ReviewStep />,
    },
    {
      id: 'checkout',
      content: <CheckoutStep />,
    },
  ];

  return (
    <StepperStoreProvider steps={steps}>
      <CheckoutStoreProvider goals={actionPlan.goals}>
        <ActionPlanCheckoutModalConsumer />
      </CheckoutStoreProvider>
    </StepperStoreProvider>
  );
}

function ActionPlanCheckoutModalConsumer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">Get Products</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90%] max-w-2xl overflow-y-auto p-0">
        <ActionPlanCheckoutContent />
      </DialogContent>
    </Dialog>
  );
}

function ActionPlanCheckoutContent() {
  const { steps, activeStep } = useStepper((s) => ({
    steps: s.steps,
    activeStep: s.activeStep,
  }));

  return (
    <>
      <div className="flex flex-col gap-2 px-7 pb-4 pt-7 md:px-14 md:pb-8 md:pt-14">
        <div className="flex w-full justify-between">
          <p className="text-[16px] text-[#A6A6A6]">Action plan</p>
          <DialogClose>
            <X className="size-6 cursor-pointer p-1" />
          </DialogClose>
        </div>
        <h2 className="text-4xl md:text-6xl">
          {capitalize(steps[activeStep].id)}
        </h2>
      </div>
      {steps[activeStep].content}
    </>
  );
}
