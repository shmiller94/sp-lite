import { motion, useAnimationControls } from 'framer-motion';
import { Check } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { useStepper } from '@/components/ui/stepper';
import { Body1, H2 } from '@/components/ui/typography';
import { ImageContentLayout } from '@/features/onboarding/components/layouts';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { cn } from '@/lib/utils';
import { AddToCalendar } from '@/shared/components';

type TimelineType = {
  title: string;
  complete: boolean;
};

const timeline: TimelineType[] = [
  { title: 'Membership confirmed', complete: true },
  {
    title: 'Schedule your test appointment',
    complete: true,
  },
  { title: 'In-person lab', complete: false },
  { title: 'Test results processed within 10 days', complete: false },
  { title: 'Results uploaded', complete: false },
  { title: 'Schedule a follow-up appointment', complete: false },
];

export const BookingSuccess = () => {
  const controls = useAnimationControls();
  const { nextOnboardingStep } = useStepper((s) => s);
  const { serviceAddress, slots, collectionMethod } = useOnboarding();

  return (
    <section id="main">
      <div className="space-y-8">
        <H2 className="text-zinc-900">
          Thank you, we look forward to seeing you shortly.
        </H2>

        <div>
          {timeline.map((step, i) => {
            const lastStep = i === timeline.length - 1;
            const isComplete = step.complete;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                onViewportEnter={() => controls.start({ opacity: 1, y: 0 })}
                transition={{ delay: i * 0.3, duration: 0.6 }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border',
                      isComplete ? 'border-green-600' : 'border-gray-300',
                    )}
                  >
                    <Check
                      size={16}
                      color={isComplete ? '#26936B' : '#71717A'}
                      className="z-10"
                    />
                  </div>
                  <Body1
                    className={cn(
                      isComplete ? 'text-green-600' : 'text-gray-400',
                      'line-clamp-1',
                    )}
                  >
                    {step.title}
                  </Body1>
                </div>
                {!lastStep && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.3 + 0.3, duration: 0.6 }}
                    className={cn(
                      'ml-[19px] h-6 w-px',
                      isComplete ? 'bg-green-600' : 'bg-gray-300',
                    )}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
        <div className="flex w-full justify-end gap-3 py-12">
          {serviceAddress && collectionMethod && slots.blood.slot && (
            <AddToCalendar
              address={serviceAddress.address}
              slot={slots.blood.slot}
              service="Superpower Blood Panel"
              collectionMethod={collectionMethod}
            />
          )}
          <Button onClick={() => nextOnboardingStep()}>Done</Button>
        </div>
      </div>
    </section>
  );
};

export const BookingSuccessStep = () => (
  <ImageContentLayout
    title="Success"
    className="bg-female-stretching"
    blockBackButton
  >
    <BookingSuccess />
  </ImageContentLayout>
);
