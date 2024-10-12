import moment from 'moment';
import { useState } from 'react';

import { Scheduler } from '@/components/shared/scheduler';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Body1, H2 } from '@/components/ui/typography';
import { SUPERPOWER_BLOOD_PANEL } from '@/const';
import { ImageContentLayout } from '@/features/onboarding/components/layouts';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { useUpdateOrder } from '@/features/orders/api/update-order';
import { useServices } from '@/features/services/api/get-services';
import { useStepper } from '@/lib/stepper';
import { OrderStatus } from '@/types/api';

const ScheduleLater = ({
  setScheduleLater,
}: {
  setScheduleLater: () => void;
}) => {
  const { jumpOnboarding, updatingStep } = useStepper((s) => s);

  return (
    <>
      <div className="space-y-1">
        <H2>Remember to schedule your service later</H2>
        <Body1 className="text-zinc-500">
          You will be able to pick a time for your lab draw and service bookings
          once you’re on the platform. You can use the “To be scheduled” tab on
          the services page to do so. Don’t forget to schedule it to get your
          test results.
        </Body1>
      </div>
      <div className="flex flex-col-reverse gap-4 pt-12 md:flex-row md:justify-end">
        <Button variant="outline" onClick={setScheduleLater}>
          Back
        </Button>
        <Button
          onClick={() => jumpOnboarding('digital-twin')}
          disabled={updatingStep}
        >
          {updatingStep ? <Spinner /> : 'Continue'}
        </Button>
      </div>
    </>
  );
};

export const PickDate = () => {
  const { nextOnboardingStep, prevStep, updatingStep } = useStepper((s) => s);
  const { data, isLoading } = useServices({});
  const {
    updateBloodSlot,
    slots,
    collectionMethod,
    serviceAddress,
    updateBloodTimezone,
  } = useOnboarding();
  const [scheduleLater, setScheduleLater] = useState(false);

  const updateOrderMutation = useUpdateOrder({});
  const superpowerBloodPanel = data?.services.find(
    (s) => s.name === SUPERPOWER_BLOOD_PANEL,
  );

  const allowOrder = slots.blood.orderId && superpowerBloodPanel?.id;

  // double check we have all of that before showing scheduler
  const allowSchedulerRender =
    serviceAddress?.address && superpowerBloodPanel?.id && collectionMethod;

  const updateBloodOrder = async () => {
    if (!allowOrder) return;

    await updateOrderMutation.mutateAsync({
      orderId: slots.blood.orderId as string,
      data: {
        location: { address: serviceAddress?.address },
        timezone: slots.blood.timezone ?? moment.tz.guess(),
        timestamp: slots.blood.slot
          ? slots.blood.slot.start
          : new Date().toISOString(),
        status: OrderStatus.pending,
      },
    });

    await nextOnboardingStep();
  };

  if (scheduleLater) {
    return <ScheduleLater setScheduleLater={() => setScheduleLater(false)} />;
  }

  return (
    <section id="main">
      <div className="space-y-1">
        <H2 className="text-zinc-900">Pick a time for your lab draw</H2>
        <Body1 className="text-[#71717A]">
          An appointment takes 15 minutes, your nurse will arrive during the
          selected time slot. We recommend booking with 2 hours of waking up to
          ensure the most accurate measurement of blood hormone levels
        </Body1>
        <div className="flex justify-end py-2">
          <Button
            variant="ghost"
            className="p-0 text-zinc-500"
            onClick={() => {
              setScheduleLater((prev) => !prev);
            }}
          >
            Skip this for now
          </Button>
        </div>
      </div>
      {allowSchedulerRender ? (
        <Scheduler
          collectionMethod={collectionMethod}
          address={serviceAddress?.address}
          serviceId={superpowerBloodPanel?.id}
          onSlotUpdate={(slot, tz) => {
            updateBloodSlot(slot);
            updateBloodTimezone(tz);
          }}
          className="max-w-none py-6"
          showCreateBtn={false}
        />
      ) : isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner size="md" variant="primary" />
        </div>
      ) : (
        <div className="flex justify-center py-10">
          <Body1 className="text-pink-700">
            Cannot load service scheduler. Contact support.
          </Body1>
        </div>
      )}
      <div className="flex flex-col-reverse gap-4 md:flex-row md:justify-end">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={updateOrderMutation.isPending}
        >
          Back
        </Button>
        <Button
          onClick={updateBloodOrder}
          disabled={!slots.blood.slot || !allowOrder || updatingStep}
        >
          {updateOrderMutation.isPending || updatingStep ? (
            <Spinner />
          ) : (
            'Confirm appointment'
          )}
        </Button>
      </div>
    </section>
  );
};

export const PickDateStep = () => (
  <ImageContentLayout title="Pick date" className="bg-female-stretching">
    <PickDate />
  </ImageContentLayout>
);
