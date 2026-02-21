import { TZDateMini } from '@date-fns/tz';
import { format } from 'date-fns';

import { Body2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { Slot } from '@/types/api';

interface SchedulerTimeSlotProps {
  timeSlot: Slot;
  selectedSlot?: Slot | null;
  tz: string;
  onSlotSelect: (slot: Slot) => void;
}

export const SchedulerTimeSlot = ({
  timeSlot,
  selectedSlot,
  tz,
  onSlotSelect,
}: SchedulerTimeSlotProps) => {
  const selected = timeSlot.start === selectedSlot?.start;

  return (
    <div
      className={cn(
        'flex cursor-pointer text-nowrap rounded-xl border bg-white p-3 duration-200 ease-in-out',
        selected
          ? 'border-vermillion-900 shadow-lg shadow-vermillion-900/10'
          : '',
      )}
      onClick={() => onSlotSelect(timeSlot)}
      role="presentation"
    >
      <Body2>{timeRangeText(timeSlot, tz)}</Body2>
    </div>
  );
};

const timeRangeText = (slot: Slot, tz: string): string => {
  const start = new TZDateMini(slot.start, tz);
  const end = new TZDateMini(slot.end, tz);

  return `${format(start, 'h:mmaaa')} — ${format(end, 'h:mmaaa')}`;
};
