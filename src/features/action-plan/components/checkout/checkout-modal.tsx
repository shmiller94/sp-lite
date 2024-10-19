import { X } from 'lucide-react';
import { ReactNode } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Body1, H2 } from '@/components/ui/typography';
import {
  CheckoutStoreProvider,
  useCheckout,
} from '@/features/action-plan/stores/checkout-store';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';
import { StepItem, StepperStoreProvider, useStepper } from '@/lib/stepper';

import { CheckoutStep } from './steps/checkout-step';
import { ReviewStep } from './steps/review-step';

export function ActionPlanCheckoutModal({ children }: { children: ReactNode }) {
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
      <CheckoutStoreProvider>
        <ActionPlanCheckoutModalConsumer>
          {children}
        </ActionPlanCheckoutModalConsumer>
      </CheckoutStoreProvider>
    </StepperStoreProvider>
  );
}

function ActionPlanCheckoutModalConsumer({
  children,
}: {
  children: ReactNode;
}) {
  const { width } = useWindowDimensions();
  const resetCheckout = useCheckout((s) => s.reset);
  const resetSteps = useStepper((s) => s.resetSteps);

  const reset = () => {
    resetCheckout();
    resetSteps();
  };

  if (width <= 768) {
    return (
      <Sheet onOpenChange={reset}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex max-h-full flex-col rounded-t-[10px]">
          <div className="flex items-center justify-between px-4 pt-16 md:pb-4">
            <SheetClose>
              <div className="flex h-[44px] min-w-[44px] items-center justify-center rounded-full bg-zinc-50">
                <X className="h-4 min-w-4" />
              </div>
            </SheetClose>
            <Body1>Action plan</Body1>
            <div className="min-w-[44px]" />
          </div>
          <div className="overflow-auto">
            <ActionPlanCheckoutContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <Dialog onOpenChange={reset}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <div className="flex flex-col">
          <div className="flex w-full items-center justify-between md:px-11 md:pb-6 md:pt-10">
            <Body1 className="text-zinc-500">Action plan</Body1>
            <DialogClose>
              <X
                className="size-6 cursor-pointer p-1 text-zinc-500"
                strokeWidth={3}
              />
            </DialogClose>
          </div>
          <div className="px-10 pt-2">
            <H2>Checkout</H2>
          </div>
        </div>
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

  return <div className="w-full break-all">{steps[activeStep].content}</div>;
}
