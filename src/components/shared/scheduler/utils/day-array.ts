import moment, { Moment } from 'moment/moment';

export const dayArray = (start: Moment, numDays: number): Moment[] => {
  const days: moment.Moment[] = [];
  let day = start;

  const end = start.clone().add(numDays, 'days');

  while (day.isBefore(end)) {
    days.push(day);
    day = day.clone().add(1, 'd');
  }

  return days;
};
