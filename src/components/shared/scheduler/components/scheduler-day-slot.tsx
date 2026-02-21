import { TZDateMini, type TZDate } from '@date-fns/tz';
import { format, isSameDay } from 'date-fns';

import { Body2, Body3, H4 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { Slot } from '@/types/api';

import { dayCount, isDisabledDaySlot } from '../utils';

interface SchedulerDaySlotProps {
  day: TZDate;
  selectedDay?: TZDate;
  slots: Slot[];
  tz: string;
  onDaySelect: (day: TZDate) => void;
}

export const SchedulerDaySlot = ({
  day,
  selectedDay,
  slots,
  tz,
  onDaySelect,
}: SchedulerDaySlotProps) => {
  const selected = selectedDay ? isSameDay(selectedDay, day) : false;
  const disabled = isDisabledDaySlot(day, slots);
  const numSlots = dayCount(day, slots);
  const dayInTz = day.timeZone === tz ? day : new TZDateMini(day.getTime(), tz);

  return (
    <div className="space-y-1.5">
      <Body2 className="pl-3">{format(dayInTz, 'EEE')}</Body2>
      <div
        className={cn(
          'w-full cursor-pointer space-y-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 transition-all duration-200',
          disabled ? 'cursor-not-allowed opacity-50' : '',
          selected && !disabled
            ? 'border-vermillion-900 shadow-lg shadow-vermillion-900/10'
            : '',
        )}
        onClick={() => {
          if (disabled) return;
          onDaySelect(day);
        }}
        role="presentation"
      >
        <H4>{format(dayInTz, 'dd')}</H4>
        <Body3 className={'text-nowrap text-secondary'}>{numSlots} slots</Body3>
      </div>
    </div>
  );
};
