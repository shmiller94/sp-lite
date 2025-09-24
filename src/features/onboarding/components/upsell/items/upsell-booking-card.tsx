import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import moment from 'moment';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Body1, Body2 } from '@/components/ui/typography';
import { GRAIL_GALLERI_MULTI_CANCER_TEST_ID } from '@/const';
import { ServiceWithMetadata } from '@/features/onboarding/hooks/use-upsell-services';
import { HealthcareServiceDialog } from '@/features/orders/components/healthcare-service-dialog';
import { StepID } from '@/features/orders/types/step-id';
import { HealthcareService, OrderStatus } from '@/types/api';

import { ItemPreview } from '../item-preview';

const StatusAction = ({
  service,
  status,
  isScheduledService,
}: {
  service: HealthcareService;
  status: OrderStatus;
  isScheduledService: boolean;
}) => {
  return status === 'DRAFT' ? (
    <HealthcareServiceDialog
      healthcareService={service}
      excludeSteps={[StepID.INFO, StepID.PHLEBOTOMY, StepID.SCHEDULER]}
    >
      <Button size="medium">{isScheduledService ? 'Book' : 'Confirm'}</Button>
    </HealthcareServiceDialog>
  ) : (
    <div className="flex items-center gap-2">
      <Body2 className="text-vermillion-900">
        {isScheduledService ? 'Booked' : 'Confirmed'}
      </Body2>
      <Check className="size-5 text-vermillion-900" />{' '}
    </div>
  );
};

export const BookingCard = ({ service }: { service: ServiceWithMetadata }) => {
  // we might expand this in the future
  const isScheduledService = service?.id === GRAIL_GALLERI_MULTI_CANCER_TEST_ID;

  if (!service.order) {
    return null;
  }

  return (
    <motion.div
      className="flex w-full items-center justify-between rounded-3xl bg-white p-3 pr-5 shadow shadow-black/[.03]"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <ItemPreview
            className="size-14 rounded-xl"
            image={service.image_transparent}
          />
        </motion.div>
        <div>
          <Body1>{service.order.name}</Body1>
          {service.order.status !== 'DRAFT' &&
            (isScheduledService ? (
              <Body1 className="text-zinc-500">
                Scheduled for{' '}
                {moment(service.order.startTimestamp).format('DD MMMM, HHa')}-
                {moment(service.order.endTimestamp).format('HHa')}
              </Body1>
            ) : (
              <Body1 className="text-zinc-500">Confirmation email sent.</Body1>
            ))}
        </div>
      </div>
      {service ? (
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <StatusAction
            status={service.order.status}
            service={service}
            isScheduledService={isScheduledService}
          />
        </motion.div>
      ) : (
        <Skeleton className="h-[56px] w-[101px]" />
      )}
    </motion.div>
  );
};
