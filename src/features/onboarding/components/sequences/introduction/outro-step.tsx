import { useEffect } from 'react';

import { TextShimmer } from '@/components/ui/text-shimmer';

import { useSequence } from '../../../hooks/use-screen-sequence';
import { Sequence } from '../../sequence';

const TIME_TO_WAIT = 5000;

export const OutroStep = () => {
  const { next } = useSequence();

  useEffect(() => {
    const timer = setTimeout(() => {
      next();
    }, TIME_TO_WAIT);

    return () => clearTimeout(timer);
  }, [next]);

  return (
    <Sequence.StepLayout centered className="max-h-screen justify-center">
      <div className="flex flex-1 items-center justify-center">
        <TextShimmer
          className="truncate text-sm [--base-color:rgba(0,0,0,0.5)] [--base-gradient-color:#ffffff]"
          duration={2}
        >
          Configuring profile...
        </TextShimmer>
      </div>
    </Sequence.StepLayout>
  );
};
