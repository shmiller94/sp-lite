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

  const selected = timeSlot.start === selectedSlot?.start;

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl cursor-pointer ease-in-out duration-200 lowercase px-4 py-5 text-left border bg-white text-primary',
        selected
          ? 'border-vermillion-900 shadow-lg shadow-vermillion-900/10'
          : '',
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
