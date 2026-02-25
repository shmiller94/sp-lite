import { m } from 'framer-motion';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Body2, H2 } from '@/components/ui/typography';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';
import { useUser } from '@/lib/auth';

export const WelcomeStep = () => {
  const { next } = useProtocolStepperContext();
  const { data, isLoading } = useUser();

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  if (isLoading) return null;

  const backgroundImage =
    data?.gender === 'female'
      ? '/protocol/entry/superpower-woman.webp'
      : '/protocol/entry/superpower-man.webp';

  return (
    <div className="relative h-screen w-full">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="relative flex h-full flex-col justify-end p-6 pb-12">
        <m.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-auto max-w-md space-y-6"
        >
          <div className="space-y-4">
            <H2 className="text-center text-white">
              Welcome {data?.firstName}
            </H2>
            <Body2 className="text-center text-white/80">
              Superpower has analyzed your lab results and identified core
              insights. Let&apos;s build a precise protocol to address these,
              tailored to you.
            </Body2>
          </div>

          <Button
            className="w-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
            onClick={handleNext}
          >
            Continue
          </Button>
        </m.div>
      </div>
    </div>
  );
};
