/* If no times available then return false as its disabled */
import { TZDateMini } from '@date-fns/tz';
import type { TZDate } from '@date-fns/tz';
import { isSameDay } from 'date-fns';

import { Slot } from '@/types/api';

export const isDisabledDaySlot = (day: TZDate, slots: Slot[]): boolean => {
  const timeZone = day.timeZone;
  if (timeZone == null) return true;

  for (const slot of slots) {
    const slotStart = new TZDateMini(slot.start, timeZone);
    if (isSameDay(day, slotStart)) {
      return false;
    }
  }

  return true;
};
