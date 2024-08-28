import React from 'react';

import { Button } from '@/components/ui/button';
import { useStepper } from '@/components/ui/stepper';
import { Body1, H2 } from '@/components/ui/typography';
import { ImageContentLayout } from '@/features/onboarding/components/layouts';

export const Identity = () => {
  // add stripe verification embed here
  const { nextStep } = useStepper((s) => s);
  return (
    <section id="main">
      <div className="mb-4 flex flex-col gap-8">
        <H2 className="text-zinc-900">
          Verify your identity to schedule your first blood test
        </H2>
        <Body1 className="text-[#71717A]">
          Get ready to take a selfie and a photo of a valid form of ID such as a
          driver’s license or passport.
        </Body1>
      </div>
      <div className="flex w-full justify-end py-12">
        <Button onClick={nextStep}>Verify me</Button>
      </div>
    </section>
  );
};

export const IdentityStep = () => (
  <ImageContentLayout title="Identity" className="bg-female-stretching">
    <Identity />
  </ImageContentLayout>
);
