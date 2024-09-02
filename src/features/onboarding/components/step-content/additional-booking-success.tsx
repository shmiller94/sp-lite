import React from 'react';

import { Button } from '@/components/ui/button';
import { useStepper } from '@/components/ui/stepper';
import { Body1, H2 } from '@/components/ui/typography';
import { AdditionalServiceCard } from '@/features/onboarding/components/additional-service-card';
import { ImageContentLayout } from '@/features/onboarding/components/layouts';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { getOrderInfo } from '@/features/onboarding/utils/get-order-info';

const AdditionalBookingSuccess = () => {
  const { nextOnboardingStep } = useStepper((s) => s);
  const { additionalServices, slots } = useOnboarding();

  // filter out all services that user skipped
  const filteredServices = additionalServices.filter((as) => {
    const orderInfo = getOrderInfo(as, slots);
    return orderInfo && (orderInfo.timestamp || orderInfo.address);
  });

  return (
    <section id="main" className="space-y-12">
      <div className="space-y-4">
        <H2 className="text-zinc-900">Order summary</H2>
        <Body1 className="text-zinc-500">
          Review your additional order details below. Make changes or select
          confirm to complete your bookings.
        </Body1>
        {filteredServices.map((service, index) => (
          <AdditionalServiceCard service={service} key={index} />
        ))}
      </div>
      <div className="flex justify-end gap-4">
        <Button onClick={nextOnboardingStep}>Done</Button>
      </div>
    </section>
  );
};

export const AdditionalBookingSuccessStep = () => (
  <ImageContentLayout title="Additional Services" className="bg-hand-pillow">
    <AdditionalBookingSuccess />
  </ImageContentLayout>
);
