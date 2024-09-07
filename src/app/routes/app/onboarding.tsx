import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { steps } from '@/features/onboarding/components/steps';
import { useUser } from '@/lib/auth';
import { StepperStoreProvider, useStepper } from '@/lib/stepper';

export const OnboardingRoute = () => {
  const { data: user } = useUser({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    if (!user?.onboarding) {
      navigate('/app', {
        replace: true,
      });
    }
  }, [user?.onboarding]);

  return (
    <AnimatePresence>
      <StepperStoreProvider
        steps={steps}
        initialStep={user?.onboarding?.progress}
      >
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
