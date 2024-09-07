/* If no times available then return false as its disabled */
import moment, { Moment } from 'moment/moment';

import { Slot } from '@/types/api';

export const isDisabledDaySlot = (day: Moment, slots: Slot[]): boolean => {
  for (const slot of slots) {
    if (day.isSame(moment(slot.start), 'day')) {
      return false;
    }
  }

  return true;
};
