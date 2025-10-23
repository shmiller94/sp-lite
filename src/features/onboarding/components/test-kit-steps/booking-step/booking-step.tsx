import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { SplitScreenLayout } from '@/components/layouts/split-screen-layout';
import { Button } from '@/components/ui/button';
import { Body1, H3 } from '@/components/ui/typography';
import { useUser } from '@/lib/auth';

import { useTestKitServices } from '../../../hooks/use-test-kits';
import { useOnboardingStepper } from '../../onboarding-steps/onboarding-stepper';
import { ItemPreviews } from '../../shared/item-previews';

import { TestKitBookingCard } from './booking-card';

const BookingStepContent = () => {
  const { data: user } = useUser();
  const { next } = useOnboardingStepper();
  const { services } = useTestKitServices();

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
              <TestKitBookingCard service={s} />
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
            <Button onClick={next} className="w-full">
              Next
            </Button>
          )}
        </motion.div>
      </div>
      <ItemPreviews services={servicesWithOrders} />
    </>
  );
};

export const BookingStep = () => (
  <SplitScreenLayout title="Book additional services" className="bg-zinc-50">
    <BookingStepContent />
  </SplitScreenLayout>
);
