import { DotIcon } from 'lucide-react';
import moment from 'moment';
import 'moment-timezone';

import { Skeleton } from '@/components/ui/skeleton';
import { Body1 } from '@/components/ui/typography';
import { Slot } from '@/types/api';

import { useScheduler } from '../stores/scheduler';
import { getFullTimezoneName } from '../utils/get-full-timezone-name';

import { SchedulerTimeSlot } from './scheduler-time-slot';

export function SchedulerTimes(): JSX.Element {
  const { selectedDay, slots, loading, startRange } = useScheduler((s) => s);

  const timeSlots = slots.filter((a: Slot) =>
    selectedDay?.isSame(moment(a.start), 'day'),
  );

  return (
    <>
      {startRange && !loading ? (
        <div className="mb-2 flex items-center gap-2">
          <Body1 className="text-sm text-zinc-500 sm:text-base">
            {selectedDay?.format('MMMM Do') ?? 'Month'}
          </Body1>
          <DotIcon className="size-5" color="#71717A" />
          <Body1 className="text-sm text-zinc-500 sm:text-base">
            {/*For Pacific Daylight Time, 'z' would output 'PDT'.*/}
            {startRange ? getFullTimezoneName(startRange.format('z')) : null}
          </Body1>
        </div>
      ) : null}
      {loading ? (
        <Skeleton className="mb-2 h-5 w-full max-w-[230px] md:h-6" />
      ) : null}
      <div className="space-y-2">
        {loading &&
          Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton className="h-[66px] w-full rounded-2xl" key={i} />
            ))}
        {!loading &&
          timeSlots.map((slot: Slot) => {
            return <SchedulerTimeSlot key={slot.start} timeSlot={slot} />;
          })}
        {!loading && !timeSlots.length ? (
          <div className="flex items-center justify-center py-10">
            <Body1 className="text-zinc-500">No times found.</Body1>
          </div>
        ) : null}
      </div>
    </>
  );
}
