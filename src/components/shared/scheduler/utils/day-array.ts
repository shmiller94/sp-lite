import type { TZDate } from '@date-fns/tz';
import { addDays, isBefore } from 'date-fns';

export const dayArray = (start: TZDate, numDays: number): TZDate[] => {
  const days: TZDate[] = [];
  let day = start;

  const end = addDays(start, numDays);

  while (isBefore(day, end)) {
    days.push(day);
    day = addDays(day, 1);
  }

  return days;
};
