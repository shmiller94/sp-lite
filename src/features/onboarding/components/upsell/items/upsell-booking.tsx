import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Body1, H3 } from '@/components/ui/typography';
import { useUpdateTask } from '@/features/tasks/api/update-task';
import { useUser } from '@/lib/auth';
import { useStepper } from '@/lib/stepper';

import { useUpsellServices } from '../../../hooks/use-upsell-services';
import { ItemPreviews } from '../item-previews';

import { BookingCard } from './upsell-booking-card';

export const UpsellBooking = () => {
  const { data: user } = useUser();
  const { nextStep, activeStep } = useStepper((s) => s);
  const { mutateAsync: updateTaskProgress, isError } = useUpdateTask();
  const { services } = useUpsellServices();

  const updateStep = async () => {
    await updateTaskProgress({
      taskName: 'onboarding',
      data: { progress: activeStep + 1 },
    });

    if (!isError) {
      nextStep();
    }
  };

  const servicesWithOrders = useMemo(() => {
    return services.filter((service) => service.order) ?? [];
  }, [services]);

  const allOrdersConfirmed = useMemo(() => {
    return servicesWithOrders.every(
      (service) => service.order?.status !== 'DRAFT',
    );
  }, [servicesWithOrders]);

  return (
    <>
      <div className="mx-auto mb-16 flex size-full flex-col items-start px-6 md:mt-0 lg:max-w-[700px] lg:pt-16">
        <motion.div
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <H3>
            Thanks, {user?.firstName}! Let&apos;s finalize shipping details.
          </H3>
          <Body1 className="text-zinc-500">
            Test kits will be shipped once you complete the informed consent and
            confirm your address below.
          </Body1>
        </motion.div>

        {servicesWithOrders.length === 0 ? (
          <motion.div
            className="flex w-full flex-col items-center justify-center space-y-2 rounded-lg border border-dashed border-zinc-200 bg-zinc-100 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          >
            <Body1 className="font-medium text-gray-600">
              No more services to book
            </Body1>
          </motion.div>
        ) : null}

        <motion.div
          className="w-full space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        >
          {servicesWithOrders.map((s, index) => (
            <motion.div
              key={s.order?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.3 + index * 0.1,
                ease: 'easeOut',
              }}
            >
              <BookingCard service={s} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex w-full items-center justify-end gap-2 py-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
        >
          {allOrdersConfirmed && (
            <Button onClick={updateStep} className="w-full">
              Next
            </Button>
          )}
        </motion.div>
      </div>
      <ItemPreviews services={servicesWithOrders} />
    </>
  );
};
