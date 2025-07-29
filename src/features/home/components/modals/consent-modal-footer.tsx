import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { SheetClose } from '@/components/ui/sheet';
import { toast } from '@/components/ui/sonner';
import { useCreateConsent } from '@/features/consent/api';
import { StepID } from '@/features/orders/types/step-id';
import { useUser } from '@/lib/auth';
import { useStepper } from '@/lib/stepper';
import { cn } from '@/lib/utils';

interface ConsentModalFooterProps {
  className?: string;
  isSubmitDisabled?: boolean;
}

export const ConsentModalFooter = ({
  className,
  isSubmitDisabled = false,
}: ConsentModalFooterProps) => {
  const { activeStep, steps, prevStep, nextStep, resetSteps } = useStepper(
    (s) => s,
  );
  const { data: user } = useUser();

  const createConsentMutation = useCreateConsent({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Consent submitted successfully');
      },
      onError: () => {
        toast.error('Failed to submit consent');
      },
    },
  });

  const currentStepId = steps[activeStep]?.id;
  const isInformedConsentStep = currentStepId === StepID.INFORMED_CONSENT;

  const handleButtonClick = async () => {
    if (isInformedConsentStep) {
      if (!user) {
        toast.error('User not found');
        return;
      }

      try {
        await createConsentMutation.mutateAsync({
          data: {
            agreedAt: new Date().toISOString(),
            userId: user.id,
          },
        });
        resetSteps(); // Reset steps before closing
      } catch (error) {
        // Error is handled by the mutation config
        console.error('Failed to create consent:', error);
      }
    } else {
      nextStep();
    }
  };

  return (
    <div
      className={cn(
        'z-50 bg-white/90 backdrop-blur-sm flex items-center justify-end',
        // Default sticky behavior for Dialog (desktop)
        'bottom-0 pb-10 [.overflow-auto_&]:sticky [.overflow-y-scroll_&]:sticky',
        // Override with fixed positioning only for Sheet (mobile) - using max-md to target mobile only
        'max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:pb-4 max-md:px-5',
        className,
      )}
    >
      <div className="flex w-full flex-col items-end gap-2 md:w-auto md:flex-row">
        {activeStep > 0 && (
          <Button variant="outline" className="w-full" onClick={prevStep}>
            Back
          </Button>
        )}
        {activeStep < steps.length &&
          (isInformedConsentStep ? (
            <DialogClose asChild>
              <SheetClose asChild>
                <Button
                  className="w-full"
                  onClick={handleButtonClick}
                  disabled={createConsentMutation.isPending || isSubmitDisabled}
                >
                  {createConsentMutation.isPending ? 'Submitting...' : 'Submit'}
                </Button>
              </SheetClose>
            </DialogClose>
          ) : (
            <Button className="w-full" onClick={handleButtonClick}>
              Next
            </Button>
          ))}
      </div>
    </div>
  );
};
