import { useEffect } from 'react';

import { Scheduler } from '@/components/shared/scheduler';
import { Body1, H2 } from '@/components/ui/typography';
import { useUser } from '@/lib/auth';
import { Slot } from '@/types/api';

import { useScheduleStore } from '../../../stores/schedule-store';
import { ScheduleFlowFooter } from '../schedule-flow-footer';

export const AdvisorySchedulerStep = () => {
  const { updateSlot, updateTz, slot, updateLocation } = useScheduleStore(
    (s) => s,
  );
  const { data: user } = useUser();

  const addressToUse = user?.primaryAddress;

  useEffect(() => {
    if (!addressToUse) return;

    // fake location so we can properly process it later
    updateLocation({
      address: addressToUse,
      name: 'ZOOM',
      capabilities: [],
      slots: [],
    });
  }, [addressToUse, updateLocation]);

  if (!addressToUse) {
    return <Body1 className="text-pink-500">No primary address found</Body1>;
  }

  const handleSelectionChange = (slot: Slot | null, tz: string) => {
    updateSlot(slot);
    updateTz(tz);
  };

  return (
    <div className="flex flex-1 flex-col justify-between">
      <div>
        <div className="space-y-1 pb-4">
          <H2>Pick a time for your appointment</H2>
        </div>
        <div className="w-full rounded-xl py-6">
          <Scheduler
            collectionMethod={'AT_HOME'}
            address={addressToUse}
            selectedSlot={slot}
            onSlotUpdate={handleSelectionChange}
            isAdvisory={true}
          />
        </div>
      </div>
      <ScheduleFlowFooter nextBtnDisabled={!slot} />
    </div>
  );
};
