import { AnimatePresence } from 'framer-motion';

import { StepperStoreProvider, useStepper } from '@/components/ui/stepper';
import { steps } from '@/features/onboarding/components/steps';

export const OnboardingRoute = () => {
  return (
    <AnimatePresence>
      <StepperStoreProvider steps={steps}>
        <Step />
      </StepperStoreProvider>
      ,
    </AnimatePresence>
  );
};

const Step = () => {
  const { steps, activeStep } = useStepper((s) => s);

  return steps[activeStep]?.content ?? null;
};
