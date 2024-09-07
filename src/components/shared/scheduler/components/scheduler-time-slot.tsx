import moment from 'moment';
import React from 'react';
import 'moment-timezone';

import { cn } from '@/lib/utils';
import { Slot } from '@/types/api';

import { useScheduler } from '../stores/scheduler';

export function SchedulerTimeSlot({
  timeSlot,
}: {
  timeSlot: Slot;
}): JSX.Element {
  const { tz, onSlotUpdate, updateSelectedSlot, selectedSlot, showCreateBtn } =
    useScheduler((s) => s);

  const selected = timeSlot === selectedSlot;

  return (
    <div
      className={cn(
        selected
          ? 'bg-[#F7F7F7] text-zinc-900'
          : 'text-zinc-500 hover:bg-[#F7F7F7] hover:text-zinc-900',
        'col-span-1 flex flex-col rounded-[8px] cursor-pointer ease-in-out duration-200 lowercase p-4 text-left',
      )}
      key={timeSlot.start}
      onClick={() => {
        updateSelectedSlot(timeSlot);

        // additionally invoke if we dont have a create button
        onSlotUpdate && !showCreateBtn && onSlotUpdate(timeSlot, tz);
      }}
      role="presentation"
    >
      {timeRangeText(timeSlot, tz)}
    </div>
  );
}

const timeRangeText = (slot: Slot, tz: string): string => {
  return `${moment(slot.start).tz(tz).format('h:mma')} — ${moment(slot.end).tz(tz).format('h:mma')}`;
};
