import { DotIcon } from 'lucide-react';
import moment from 'moment';
import React from 'react';
import 'moment-timezone';

import { useScheduler } from '@/components/ui/scheduler/stores';
import { cn } from '@/lib/utils';
import { Slot } from '@/types/api';

import { SchedulerTimeSlot } from './scheduler-time-slot';

export function SchedulerTimes(): JSX.Element {
  const { selectedDay, slots, tz } = useScheduler((s) => s);

  const timeSlots = slots.filter((a: Slot) =>
    selectedDay?.isSame(moment(a.start), 'day'),
  );

  return (
    <>
      {timeSlots.length > 0 && (
        <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400 md:text-base">
          {moment(timeSlots[0]?.start).tz(tz).format('MMMM Do')}
          <DotIcon className="size-3" color="#71717A" />
          <h5 className="mr-1 tracking-wider">
            {fullAbbr(moment(timeSlots[0]?.start).tz(tz).format('zz'))}
          </h5>
        </div>
      )}
      <div className="items-center text-center">
        <div
          className={cn(
            'p-2 rounded-2xl space-y-2 max-h-[270px] overflow-y-scroll',
            timeSlots.length > 0 ? 'border border-[#E4E4E7]' : '',
          )}
        >
          {timeSlots.map((slot: Slot) => {
            return <SchedulerTimeSlot key={slot.start} timeSlot={slot} />;
          })}
        </div>
      </div>
    </>
  );
}

const abbrs: Record<string, string> = {
  EST: 'Eastern Standard Time',
  EDT: 'Eastern Daylight Time',
  CST: 'Central Standard Time',
  CDT: 'Central Daylight Time',
  MST: 'Mountain Standard Time',
  MDT: 'Mountain Daylight Time',
  PST: 'Pacific Standard Time',
  PDT: 'Pacific Daylight Time',
};

function fullAbbr(abbr: string): string {
  return abbrs[abbr] || abbr;
}
