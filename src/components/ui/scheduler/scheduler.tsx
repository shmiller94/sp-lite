import moment from 'moment';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  SchedulerStoreProvider,
  useScheduler,
} from '@/components/ui/scheduler/stores';
import { Body1 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { Slot } from '@/types/api';

import { SchedulerDays, SchedulerHeading, SchedulerTimes } from './components';

interface Props {
  slots: Slot[];
  tz?: string;
  updateStart: (date: Date) => void;
  slotsLoading?: boolean;
  onSlotUpdate?: (slot: Slot | null) => void;
  numDays?: number;
  className?: string;
  displayCancellationNote?: boolean;
  showCreateBtn?: boolean;
}

/*
 * Scheduler component lets you schedule times with specific timezone (tz)
 *
 * If showCreateBtn is not passed, onCreate should be passed
 *
 * showCreateBtn is true by default, you can disable it if needed
 * */
export function Scheduler(props: Props) {
  const {
    className,
    tz,
    slotsLoading,
    numDays,
    displayCancellationNote = false,
    showCreateBtn = true,
    ...rest
  } = props;

  const lTz = tz ?? moment.tz.guess();
  const lSlotsLoading = slotsLoading ?? false;
  const lNumDays = numDays ?? 5;

  return (
    <SchedulerStoreProvider
      tz={lTz}
      slotsLoading={lSlotsLoading}
      numDays={lNumDays}
      showCreateBtn={showCreateBtn}
      {...rest}
    >
      <SchedulerConsumer
        className={className}
        displayCancellationNote={displayCancellationNote}
        showCreateBtn={showCreateBtn}
      />
    </SchedulerStoreProvider>
  );
}

function SchedulerConsumer({
  className,
  displayCancellationNote = false,
  showCreateBtn = false,
}: {
  className?: string;
  displayCancellationNote?: boolean;
  showCreateBtn?: boolean;
}): JSX.Element {
  const {
    slots,
    slot,
    startRange,
    updateStartRange,
    tz,
    onSlotUpdate,
    updateSelectedDay,
  } = useScheduler((s) => s);

  useEffect(() => {
    if (!slots.length) return;

    const convertedMoment = moment.utc(slots[0].start).tz(tz);
    if (moment(convertedMoment).isAfter(startRange)) {
      updateStartRange(convertedMoment);
    }
    updateSelectedDay(undefined);
  }, [slots]);

  return (
    <div className={cn('max-w-[800px] space-y-10', className)}>
      <div className="flex flex-col justify-end">
        <div className="mb-2">
          <SchedulerHeading />
        </div>
        <SchedulerDays />
        <SchedulerTimes />
        {displayCancellationNote && (
          <div className="mt-6">
            <Body1 className="text-zinc-500">
              Rescheduling or cancelling less than 24 hours in advance of your
              scheduled appointment will result in a $99 re-booking fee. Refer
              to our Terms of Service for more details.
            </Body1>
          </div>
        )}
        {showCreateBtn && onSlotUpdate && (
          <div className="mt-6 flex justify-end">
            <Button
              disabled={slot === undefined}
              onClick={() => {
                slot && onSlotUpdate(slot);
              }}
              className="rounded-xl bg-[#18181B] px-8 py-4 text-white hover:bg-[#18181B]/80"
            >
              Confirm Appointment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
