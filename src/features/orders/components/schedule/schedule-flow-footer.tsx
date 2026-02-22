import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

import { useScheduleFlowStepper } from './schedule-stepper';

export const ScheduleFlowFooter = ({
  nextBtn,
  prevBtn,
  prevBtnDisabled,
  nextBtnDisabled,
}: {
  prevBtn?: ReactNode | null;
  nextBtn?: ReactNode | null;
  prevBtnDisabled?: boolean;
  nextBtnDisabled?: boolean;
}) => {
  const { isLast, next, prev, isFirst } = useScheduleFlowStepper();

  let prevButton: ReactNode | null = null;
  if (!isFirst) {
    if (prevBtn === undefined) {
      prevButton = (
        <Button
          variant="outline"
          className="w-full bg-white"
          onClick={prev}
          disabled={prevBtnDisabled}
        >
          Back
        </Button>
      );
    } else {
      prevButton = prevBtn;
    }
  }

  let nextButton: ReactNode | null = null;
  if (nextBtn) {
    nextButton = nextBtn;
  } else if (!isLast) {
    nextButton = (
      <Button onClick={next} className="w-full" disabled={nextBtnDisabled}>
        Next
      </Button>
    );
  }

  return (
    <div className="flex items-center py-4 backdrop-blur-sm md:py-8">
      <div className="flex w-full flex-col-reverse justify-end gap-4 md:flex-row md:gap-2">
        {prevButton}
        {nextButton}
      </div>
    </div>
  );
};
