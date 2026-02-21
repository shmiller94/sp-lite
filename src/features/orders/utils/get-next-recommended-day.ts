import { addDays, format, getDay } from 'date-fns';

// It is recommended to take first actions 72 hours before the appointment
export const getNextRecommendedDay = () => {
  let nextDay = addDays(new Date(), 3);
  let day = getDay(nextDay);

  while (day === 0 || day === 6) {
    nextDay = addDays(nextDay, 1);
    day = getDay(nextDay);
  }

  return format(nextDay, 'EEEE, d MMMM');
};
