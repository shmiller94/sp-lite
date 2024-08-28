import moment, { Moment } from 'moment';
import 'moment-timezone';

import { useScheduler } from '@/components/ui/scheduler/stores';
import { cn } from '@/lib/utils';

import { dayCount, isDisabledDaySlot } from '../utils';

export function SchedulerDaySlot({ day }: { day: Moment }): JSX.Element {
  const { updateSelectedDay, selectedDay, slots, tz } = useScheduler((s) => s);

  const selected = selectedDay?.isSame(day, 'day') || false;
  const disabled = isDisabledDaySlot(day, slots);
  const numSlots = dayCount(day, slots);

  return (
    <div
      className={cn(
        'p-4 border rounded-2xl w-full border-zinc-200 cursor-pointer',
        disabled ? 'cursor-not-allowed' : '',
        selected && !disabled
          ? 'border-2 border-zinc-900 bg-[#F7F7F7] cursor-default'
          : '',
      )}
      onClick={() => {
        if (isDisabledDaySlot(day, slots)) return;
        updateSelectedDay(day);
      }}
      role="presentation"
    >
      <div
        className={cn(
          'flex flex-row sm:flex-col justify-between h-full',
          !selected ? 'border border-transparent' : '',
        )}
      >
        <div className="flex flex-row items-center gap-1.5 sm:flex-col sm:items-start">
          <span
            className={cn(
              'text-base',
              selected
                ? 'text-zinc-900'
                : disabled
                  ? 'text-zinc-200'
                  : 'text-zinc-500',
            )}
          >
            {moment(day).tz(tz).format('dddd').substring(0, 3)}
          </span>
          <span
            className={cn(
              'text-base sm:text-6xl',
              selected
                ? 'text-zinc-900'
                : disabled
                  ? 'text-zinc-200'
                  : 'text-zinc-500',
            )}
          >
            {moment(day).tz(tz).format('DD')}
          </span>
        </div>
        <span
          className={cn(
            'text-sm',
            selected
              ? 'text-zinc-900'
              : disabled
                ? 'text-zinc-200'
                : 'text-zinc-500',
          )}
        >
          {numSlots && numSlots > 0 ? numSlots : 'No'} slots
        </span>
      </div>
    </div>
  );
}
