import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import 'moment-timezone';

import { useScheduler } from '@/components/ui/scheduler/stores';
import { Spinner } from '@/components/ui/spinner';

import { RangeSelectButton } from './range-select-button';

export function SchedulerHeading(): JSX.Element {
  const {
    updateSelectedDay,
    tz,
    updateStart,
    slotsLoading,
    updateStartRange,
    startRange,
    numDays,
    updateSlot,
    onSlotUpdate,
    showCreateBtn,
  } = useScheduler((s) => s);

  const handleClick = (numDays: number): void => {
    const newStartRange = startRange.clone().add(numDays, 'days').tz(tz);

    updateStart(newStartRange.toDate());
    updateStartRange(newStartRange);
    updateSelectedDay(undefined);
    updateSlot(undefined);

    // additional callback if native button is hidden
    onSlotUpdate && !showCreateBtn && onSlotUpdate(null);
  };

  return (
    <div className="flex justify-between text-[#71717A]">
      <h5 className="flex flex-row items-center justify-start space-x-2 tracking-wider">
        <span>{startRange?.tz(tz).format('MMMM')}</span>
      </h5>
      <div className="flex flex-row items-center">
        <div className="flex flex-row items-center">
          {slotsLoading ? (
            <span className="flex size-6 items-center">
              <Spinner />
            </span>
          ) : (
            <>
              <RangeSelectButton
                icon={<ChevronLeft className="size-4" />}
                onClick={() => {
                  handleClick(-numDays);
                }}
              />
              <RangeSelectButton
                icon={<ChevronRight className="size-4" />}
                onClick={() => {
                  handleClick(numDays);
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
