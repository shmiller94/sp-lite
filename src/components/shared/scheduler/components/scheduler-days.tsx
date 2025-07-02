import { Moment } from 'moment';
import { useEffect } from 'react';
import 'moment-timezone';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Body1 } from '@/components/ui/typography';
import { ADVISORY_CALL } from '@/const';
import { useStepper } from '@/lib/stepper';

import { useScheduler } from '../stores/scheduler';
import { dayArray, isDisabledDaySlot } from '../utils';

import { SchedulerDaySlot } from './scheduler-day-slot';
export function SchedulerDays(): JSX.Element {
  const {
    selectedDay,
    slots,
    updateSelectedDay,
    startRange,
    numDays,
    loading,
    service,
  } = useScheduler((s) => s);

  useEffect(() => {
    if (!startRange || !numDays) return;

    for (const day of dayArray(startRange, numDays).reverse()) {
      if (!selectedDay && !isDisabledDaySlot(day, slots)) {
        updateSelectedDay(day);
      }
    }
  }, [slots]);
  const { prevStep } = useStepper((s) => s);

  const renderDays = numDays && startRange && slots.length > 0 && !loading;

  if (slots.length === 0 && !loading) {
    return (
      <div className="mb-8 flex flex-col items-center justify-center sm:h-[200px]">
        <Body1 className="text-center text-zinc-500">
          We were unable to find available slots within the next few months.
          <br />
          {service.name === ADVISORY_CALL
            ? 'Please check back again later.'
            : 'Please pick a different location.'}
        </Body1>

        {service.name === ADVISORY_CALL ? null : (
          <Button
            variant="outline"
            className="mt-4 w-full md:w-auto"
            onClick={prevStep}
          >
            Pick new location
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="mb-8 flex flex-col justify-start gap-2 sm:h-[200px] sm:flex-row">
      {loading &&
        Array(numDays)
          .fill(0)
          .map((_, indx) => (
            <Skeleton
              className="h-[60px] w-full min-w-fit rounded-2xl sm:h-[200px]"
              key={indx}
            />
          ))}
      {renderDays
        ? dayArray(startRange, numDays).map((day: Moment): JSX.Element => {
            return (
              <div key={day.format()} className="flex w-full">
                <SchedulerDaySlot day={day} />
              </div>
            );
          })
        : null}
    </div>
  );
}
