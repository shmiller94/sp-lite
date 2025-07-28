// ConsentModal.tsx
import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useGetConsent } from '@/features/consent/api';
import { InformedConsentStep } from '@/features/home/components/modals/consent-modal-informed-consent-step';
import { ConsentNoticeStep } from '@/features/home/components/modals/consent-modal-notice-step';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';
import { useUser } from '@/lib/auth';
import { StepItem, StepperStoreProvider, useStepper } from '@/lib/stepper';

const CONSENT_MODAL_STORAGE_KEY = 'consent-modal-open';

const steps: StepItem[] = [
  {
    id: 'consent_notice',
    content: <ConsentNoticeStep />,
  },
  {
    id: 'informed_consent',
    content: <InformedConsentStep />,
  },
];

interface ConsentModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialStep?: 'consent_notice' | 'informed_consent';
}

export const ConsentModal = ({
  open,
  onOpenChange,
  initialStep,
}: ConsentModalProps = {}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const { data: user } = useUser();
  const { width } = useWindowDimensions();
  const resetStepsRef = useRef<(() => void) | null>(null);
  const isMobile = width <= 768;

  const consentQuery = useGetConsent({
    userId: user?.id || '',
  });

  const isOpen = open !== undefined ? open : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;

  // Handle modal opening logic - prioritize URL parameters over localStorage
  useEffect(() => {
    if (open === undefined && user && !consentQuery.isLoading) {
      const hasConsent = consentQuery.data?.exists;

      // Check URL parameters first (higher priority)
      const urlParams = new URLSearchParams(window.location.search);
      const showConsentFromUrl = urlParams.get('consent') === 'true';

      if (showConsentFromUrl && !hasConsent) {
        setInternalIsOpen(true);
        localStorage.setItem(CONSENT_MODAL_STORAGE_KEY, 'true');
        window.history.replaceState(null, '', window.location.pathname);
        return; // Exit early since URL parameter takes precedence
      }

      // If no URL parameter, check localStorage
      const shouldShowModalFromStorage =
        localStorage.getItem(CONSENT_MODAL_STORAGE_KEY) === 'true';

      if (shouldShowModalFromStorage && !hasConsent) {
        setInternalIsOpen(true);
      }
    }
  }, [user, open, consentQuery.data, consentQuery.isLoading]);

  if (!user) return null;

  const stepId = initialStep || 'consent_notice';
  const initialStepIndex = steps.findIndex((s) => s.id === stepId);

  const Step = () => {
    const { steps, activeStep, resetSteps } = useStepper((s) => s);
    const currentStep = steps[activeStep];

    // Store resetSteps in ref for access outside the component
    resetStepsRef.current = resetSteps;

    return currentStep?.content ?? null;
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (!open) {
      // Clear localStorage when modal is properly closed
      localStorage.removeItem(CONSENT_MODAL_STORAGE_KEY);

      // Reset stepper when modal closes
      if (resetStepsRef.current) {
        resetStepsRef.current();
      }
    } else {
      // Store in localStorage when modal is opened
      localStorage.setItem(CONSENT_MODAL_STORAGE_KEY, 'true');
    }
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent
          className="overflow-hidden rounded-2xl px-5 pt-20 max-md:pb-24"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <AnimatePresence>
            <StepperStoreProvider steps={steps} initialStep={initialStepIndex}>
              <Step />
            </StepperStoreProvider>
          </AnimatePresence>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="overflow-hidden px-16 pt-20"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <AnimatePresence>
          <StepperStoreProvider steps={steps} initialStep={initialStepIndex}>
            <Step />
          </StepperStoreProvider>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
