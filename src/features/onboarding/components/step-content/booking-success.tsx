import React from 'react';

import { AddToCalendar } from '@/components/shared/add-to-calendar-button';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Timeline } from '@/components/ui/timeline';
import { H2 } from '@/components/ui/typography';
import { SUPERPOWER_BLOOD_PANEL } from '@/const';
import { ImageContentLayout } from '@/features/onboarding/components/layouts';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { getOnboardingTimeline } from '@/features/onboarding/utils/get-onboarding-timeline';
import { useStepper } from '@/lib/stepper';

export const BookingSuccess = () => {
  const { nextOnboardingStep, updatingStep } = useStepper((s) => s);
  const { serviceAddress, slots, collectionMethod } = useOnboarding();

  const timeline = getOnboardingTimeline(collectionMethod);

  return (
    <section id="main">
      <div className="space-y-8">
        <H2 className="text-zinc-900">
          Thank you, we look forward to seeing you shortly.
        </H2>

        <Timeline timeline={timeline} />
        <div className="flex w-full justify-end gap-3 py-12">
          {serviceAddress && collectionMethod && slots.blood.slot && (
            <AddToCalendar
              address={serviceAddress.address}
              slot={slots.blood.slot}
              service={SUPERPOWER_BLOOD_PANEL}
              collectionMethod={collectionMethod}
            />
          )}
          <Button onClick={() => nextOnboardingStep()} disabled={updatingStep}>
            {updatingStep ? <Spinner /> : 'Done'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export const BookingSuccessStep = () => (
  <ImageContentLayout
    title="Success"
    className="bg-female-stretching"
    blockBackButton
  >
    <BookingSuccess />
  </ImageContentLayout>
);
