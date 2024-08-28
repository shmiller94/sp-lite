import moment, { Moment } from 'moment/moment';

import { Slot } from '@/types/api';

export const dayCount = (day: Moment, slots: Slot[]): number => {
  let numSlots = 0;
  for (const slot of slots) {
    if (day.isSame(moment(slot.start), 'day')) {
      numSlots++;
    }
  }

  return numSlots;
};
