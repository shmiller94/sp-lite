import { Moment } from 'moment';
import { useEffect } from 'react';
import 'moment-timezone';

import { useScheduler } from '@/components/ui/scheduler/stores';

import { dayArray, isDisabledDaySlot } from '../utils';

import { SchedulerDaySlot } from './scheduler-day-slot';

export function SchedulerDays(): JSX.Element {
  const { selectedDay, slots, updateSelectedDay, startRange, numDays } =
    useScheduler((s) => s);

  useEffect(() => {
    for (const day of dayArray(startRange, numDays).reverse()) {
      if (!selectedDay && !isDisabledDaySlot(day, slots)) {
        updateSelectedDay(day);
      }
    }
  }, [slots]);

  return (
    <div className="mb-8 flex flex-col justify-start gap-2 sm:h-[200px] sm:flex-row">
      {dayArray(startRange, numDays).map((day: Moment): JSX.Element => {
        return (
          <div key={day.format()} className="flex w-full">
            <SchedulerDaySlot day={day} />
          </div>
        );
      })}
    </div>
  );
}
