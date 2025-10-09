import { useEffect } from 'react';

import { Scheduler } from '@/components/shared/scheduler';
import { Body1, H2 } from '@/components/ui/typography';
import { ADVISORY_CALL } from '@/const';
import { HealthcareServiceFooter } from '@/features/orders/components/healthcare-service-footer';
import { HEALTHCARE_SERVICE_DIALOG_CONTAINER_STYLE } from '@/features/orders/const/config';
import { useOrder } from '@/features/orders/stores/order-store';
import { getCollectionInstructions } from '@/features/orders/utils/get-collection-instructions';
import { shouldUsePrimaryAddress } from '@/features/orders/utils/should-use-primary-address';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';
import { useUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Address, Slot } from '@/types/api';

export const PhlebotomyScheduler = () => {
  const {
    service,
    location,
    collectionMethod,
    updateSlot,
    setTz,
    slot,
    updateLocation,
  } = useOrder((s) => s);
  const { width } = useWindowDimensions();
  const { data: user } = useUser();

  const usePrimaryAddress = shouldUsePrimaryAddress(service, collectionMethod);

  useEffect(() => {
    if (usePrimaryAddress && !location?.address && user?.primaryAddress) {
      updateLocation({ address: user.primaryAddress });
    }
  }, [
    usePrimaryAddress,
    location?.address,
    user?.primaryAddress,
    updateLocation,
  ]);

  // If not advisory and still no collectionMethod, throw an error
  if (!collectionMethod) {
    throw new Error(
      'Collection method must be defined to use PhlebotomyScheduler',
    );
  }

  const onSlotUpdate = (selectedSlot: Slot | null, tz?: string) => {
    if (selectedSlot) updateSlot(selectedSlot);
    if (tz) setTz(tz);
  };

  const numDaysToShow = width > 600 ? 5 : 4;
  const instructions = getCollectionInstructions(collectionMethod);

  const addressToUse =
    usePrimaryAddress && user?.primaryAddress
      ? user.primaryAddress
      : location?.address;

  return (
    <>
      <div className={cn(HEALTHCARE_SERVICE_DIALOG_CONTAINER_STYLE)}>
        <div className="space-y-1 pb-4">
          <H2>Pick a time for your appointment</H2>
          <Body1 className="text-zinc-500">
            {service.name === ADVISORY_CALL ? undefined : instructions}
          </Body1>
        </div>
        <div className="w-full rounded-xl py-6">
          <Scheduler
            collectionMethod={collectionMethod}
            address={addressToUse as Address}
            service={service}
            onSlotUpdate={onSlotUpdate}
            displayCancellationNote={
              service.name === ADVISORY_CALL
                ? false
                : collectionMethod !== 'IN_LAB'
            }
            showCreateBtn={false}
            numDays={numDaysToShow}
          />
        </div>
      </div>
      <HealthcareServiceFooter nextBtnDisabled={!slot} />
    </>
  );
};
