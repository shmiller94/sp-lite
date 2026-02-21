import { TZDateMini, type TZDate } from '@date-fns/tz';
import { isSameDay } from 'date-fns';

import { Slot } from '@/types/api';

export const dayCount = (day: TZDate, slots: Slot[]): number => {
  const timeZone = day.timeZone;
  if (timeZone == null) return 0;

  let numSlots = 0;
  for (const slot of slots) {
    const slotStart = new TZDateMini(slot.start, timeZone);
    if (isSameDay(day, slotStart)) {
      numSlots++;
    }
  }

  return numSlots;
};
