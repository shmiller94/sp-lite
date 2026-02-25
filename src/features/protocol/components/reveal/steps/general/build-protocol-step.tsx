import { m } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useCallback, useState } from 'react';

import { SuperpowerLogo } from '@/components/icons/superpower-logo';
import { ShimmerDune } from '@/components/shared/shimmer-dune';
import { H2, Body1, Body2 } from '@/components/ui/typography';
import { VerticalSlideToUnlock } from '@/components/ui/vertical-slide-to-unlock';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';

import { ProtocolStepLayout } from '../../../layouts/protocol-step-layout';

export const BuildProtocolStep = () => {
  const { next } = useProtocolStepperContext();
  const [progress, setProgress] = useState(0);

  const handleComplete = useCallback(() => {
    next();
  }, [next]);

  const handleProgress = useCallback((value: number) => {
    setProgress(value);
  }, []);

  return (
    <ProtocolStepLayout>
      <SuperpowerLogo className="mx-auto max-w-28" />
      <div className="relative">
        <ShimmerDune />
        <div className="relative z-10 -mt-16">
          <H2 className="mb-1 text-center md:text-3xl">
            Let&apos;s build your protocol
          </H2>
          <Body1 className="mb-6 text-balance text-center text-secondary">
            Based on your data and preferences we&apos;ll create your protocol.
          </Body1>
        </div>
      </div>
      <div className="space-y-4">
        <div className="mx-auto h-64 w-full max-w-20">
          <VerticalSlideToUnlock
            className="relative flex h-full flex-col items-center justify-center overflow-visible rounded-full"
            onComplete={handleComplete}
            onProgress={handleProgress}
          >
            <div className="absolute inset-4 bg-gradient-to-t from-yellow-400 to-red-200 opacity-40 blur-xl" />
            <div
              className="relative z-10 flex size-full flex-col items-center justify-center transition-opacity duration-200"
              style={{ opacity: progress >= 1 ? 0 : 1 }}
            >
              {Array.from({ length: 4 }, (_, index) => (
                <m.div
                  key={index}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: (3 - index) * 0.2,
                    ease: 'easeInOut',
                  }}
                  className="-mb-2"
                >
                  <ChevronUp className="text-white" />
                </m.div>
              ))}
            </div>
          </VerticalSlideToUnlock>
        </div>
        <Body2 className="text-center">Swipe up to start</Body2>
      </div>
    </ProtocolStepLayout>
  );
};
