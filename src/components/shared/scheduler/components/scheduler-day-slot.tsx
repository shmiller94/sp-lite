import moment, { Moment } from 'moment';
import 'moment-timezone';

import { Body1, Body2, H2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { useScheduler } from '../stores/scheduler';
import { dayCount, isDisabledDaySlot } from '../utils';

export function SchedulerDaySlot({ day }: { day: Moment }): JSX.Element {
  const { updateSelectedDay, selectedDay, slots, tz } = useScheduler((s) => s);

  const selected = selectedDay?.isSame(day, 'day') || false;
  const disabled = isDisabledDaySlot(day, slots);
  const numSlots = dayCount(day, slots);

  return (
    <div
      className={cn(
        'p-4 border rounded-2xl w-full transition-all duration-200 border-zinc-200 bg-white cursor-pointer px-4 py-5 space-y-1',
        disabled ? 'cursor-not-allowed opacity-50' : '',
        selected && !disabled
          ? 'border-vermillion-900 shadow-lg shadow-vermillion-900/10'
          : '',
      )}
      onClick={() => {
        if (isDisabledDaySlot(day, slots)) return;
        updateSelectedDay(day);
      }}
      role="presentation"
    >
      <Body1>{moment(day).tz(tz).format('dddd').substring(0, 3)}</Body1>
      <H2>{moment(day).tz(tz).format('DD')}</H2>
      <Body2 className={'text-secondary'}>
        {numSlots && numSlots > 0 ? numSlots : 'No'} slots
      </Body2>
    </div>
  );
}
