import React from 'react';

import { Button } from '@/components/ui/button';
import { Scheduler } from '@/components/ui/scheduler';
import { useStepper } from '@/components/ui/stepper';
import { Body1, H2 } from '@/components/ui/typography';
import { ImageContentLayout } from '@/features/onboarding/components/layouts';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';

export const PickDate = () => {
  const { nextStep, prevStep } = useStepper((s) => s);
  const { updateBloodSlot, slots } = useOnboarding();

  // const getPhlebotomyAvailabilityMutation = usePhlebotomyAvailability();

  // const [start, setStart] = useState<Date>(new Date());
  // const [slots, setSlots] = useState<Slot[]>([]);

  // useEffect(() => {
  //   if (!healthcareService || !location?.address || !collectionMethod)
  //     throw Error('Missing fields to query availability');
  //
  //   getPhlebotomyAvailabilityMutation
  //     .mutateAsync({
  //       serviceId: healthcareService.id,
  //       address: location.address,
  //       start: start.toISOString(),
  //       collectionMethod: collectionMethod,
  //     })
  //     .then((response) => {
  //       setSlots(response.slots);
  //       setTz(response.timezone || moment.tz.guess());
  //     });
  // }, [start]);

  return (
    <section id="main">
      <div className="space-y-1">
        <H2 className="text-zinc-900">Pick a time for your lab draw</H2>
        <Body1 className="text-[#71717A]">
          An appointment takes 15 minutes, your nurse will arrive during the
          selected time slot. We recommend booking with 2 hours of waking up to
          ensure the most accurate measurement of blood hormone levels
        </Body1>
      </div>
      <Scheduler
        // todo: rewrite this with mock response
        slots={[
          {
            start: '2024-09-09T16:15:00.000Z',
            end: '2024-09-09T16:30:00.000Z',
          },
          {
            start: '2024-09-09T17:15:00.000Z',
            end: '2024-09-09T17:30:00.000Z',
          },
          {
            start: '2024-09-09T17:30:00.000Z',
            end: '2024-09-09T17:45:00.000Z',
          },
          {
            start: '2024-09-09T17:45:00.000Z',
            end: '2024-09-09T18:00:00.000Z',
          },
        ]}
        slotsLoading={false}
        // updateStart={(date) => setStart(date)}
        updateStart={(date) => console.log(date)}
        onSlotUpdate={(slot) => {
          updateBloodSlot(slot);
        }}
        className="max-w-none py-6"
        showCreateBtn={false}
      />
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep} disabled={!slots.blood}>
          Confirm appointment
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
