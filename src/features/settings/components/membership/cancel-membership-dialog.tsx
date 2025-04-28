import React from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CancelMembership } from '@/features/settings/components/membership/cancel-membership';
import { BenefitsStep } from '@/features/settings/components/membership/steps/benefits';
import { ConfirmationStep } from '@/features/settings/components/membership/steps/confirmation';
import { GotItStep } from '@/features/settings/components/membership/steps/got-it';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';
import { StepItem, StepperStoreProvider, useStepper } from '@/lib/stepper';
import { Subscription } from '@/types/api';

interface CancelMembershipDialogProps {
  children: JSX.Element;
  membership?: Subscription;
}

export const CancelMembershipDialog = ({
  children,
  membership,
}: CancelMembershipDialogProps): JSX.Element => {
  const CANCEL_STEPS: StepItem[] = [
    { content: <BenefitsStep />, id: 'benefits' },
    { content: <ConfirmationStep />, id: 'confirmation' },
    { content: <GotItStep />, id: 'gotit' },
  ];

  return (
    <StepperStoreProvider steps={CANCEL_STEPS}>
      <CancelDialog membership={membership}>{children}</CancelDialog>
    </StepperStoreProvider>
  );
};

const CancelDialog = ({
  children,
  membership,
}: CancelMembershipDialogProps) => {
  const { resetSteps } = useStepper((s) => s);
  const { width } = useWindowDimensions();

  if (!membership) return null;

  if (width <= 768) {
    return (
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex max-h-full flex-col rounded-t-[10px] p-0">
          <CancelMembership subscription={membership} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog onOpenChange={resetSteps}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="mx-auto w-fit max-w-max p-0">
        <CancelMembership subscription={membership} />
      </DialogContent>
    </Dialog>
  );
};
