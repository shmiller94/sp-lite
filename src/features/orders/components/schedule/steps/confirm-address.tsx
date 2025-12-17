import { useEffect } from 'react';

import { H2 } from '@/components/ui/typography';
import { SHARED_CONTAINER_STYLE } from '@/features/orders/const/config';
import { CurrentAddressCard } from '@/features/users/components/current-address-card';
import { useUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

import { useScheduleStore } from '../../../stores/schedule-store';
import { ScheduleFlowFooter } from '../schedule-flow-footer';

export const ConfirmAddressStep = () => {
  const { updateLocation, location } = useScheduleStore((s) => s);
  const { data: user } = useUser();

  useEffect(() => {
    if (!user?.primaryAddress) {
      return;
    }

    updateLocation({
      address: user.primaryAddress,
      capabilities: ['APPOINTMENT_SCHEDULING'],
      name: '',
    });
  }, [user?.primaryAddress]);

  return (
    <>
      <div className={cn('space-y-8', SHARED_CONTAINER_STYLE)}>
        <H2 className="text-2xl md:text-3xl">Confirm shipping address</H2>
        <CurrentAddressCard disableEdit={true} />
      </div>
      <ScheduleFlowFooter nextBtnDisabled={!location} />
    </>
  );
};
