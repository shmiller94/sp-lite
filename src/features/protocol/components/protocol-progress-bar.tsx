import { m } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import { PROTOCOL_STEPS } from './reveal/protocol-stepper';
import { useProtocolStepperContext } from './reveal/protocol-stepper-context';

const PROGRESS_BAR_HIDDEN_STEPS = [
  PROTOCOL_STEPS.WELCOME,
  PROTOCOL_STEPS.VIDEO_SEQUENCE,
  PROTOCOL_STEPS.BIOLOGICAL_AGE,
  PROTOCOL_STEPS.SUPERPOWER_SCORE,
];

const PROGRESS_BAR_NO_BACKDROP_STEPS = [PROTOCOL_STEPS.FINAL_PROTOCOL_READY];

const STORAGE_KEY = 'protocol-progress-percentage';

type ProtocolProgressBarProps = {
  currentStep: string;
};

export const ProtocolProgressBar = ({
  currentStep,
}: ProtocolProgressBarProps) => {
  const { previous, allSteps, getCurrentStepIndex, isFirstStep } =
    useProtocolStepperContext();

  const currentIndex = getCurrentStepIndex();
  const totalSteps = allSteps.length;
  const progressPercentage = ((currentIndex + 1) / totalSteps) * 100;
  const canGoBack = !isFirstStep();

  // Read the previous percentage from sessionStorage on mount only
  const [startPercentage] = useState(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored !== null ? parseFloat(stored) : progressPercentage;
  });

  // Save current percentage to sessionStorage after component mounts
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, String(progressPercentage));
  }, [progressPercentage]);

  const shouldHide = PROGRESS_BAR_HIDDEN_STEPS.includes(
    currentStep as (typeof PROGRESS_BAR_HIDDEN_STEPS)[0],
  );

  if (shouldHide) {
    return null;
  }

  const shouldHideBackdrop = PROGRESS_BAR_NO_BACKDROP_STEPS.includes(
    currentStep as (typeof PROGRESS_BAR_NO_BACKDROP_STEPS)[0],
  );

  return (
    <div className="sticky inset-x-0 top-0 z-50">
      <div
        className={`flex items-center gap-4 p-4 ${
          shouldHideBackdrop ? '' : 'bg-zinc-50/50 backdrop-blur-lg'
        }`}
      >
        <Button
          variant="ghost"
          size="small"
          onClick={previous}
          disabled={!canGoBack}
          className="size-8 shrink-0 p-0 disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <div className="mx-auto max-w-md flex-1">
          <div
            className={`h-1 w-full overflow-hidden rounded-full ${
              shouldHideBackdrop ? 'bg-gray-200/50' : 'bg-gray-200'
            }`}
          >
            <m.div
              className="h-full rounded-full bg-zinc-800"
              initial={{ width: `${startPercentage}%` }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="size-8 shrink-0" />
      </div>
    </div>
  );
};
