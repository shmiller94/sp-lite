import { m } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Body1, H2 } from '@/components/ui/typography';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';

import { ProtocolStepLayout } from '../../../layouts/protocol-step-layout';

const MOCK_STEPS = [
  {
    title: 'Use iodized salt and a selenium‑rich food daily',
    image: '/protocol/decision/healthy-food.webp',
  },
  {
    title: 'Take a vitamin D + K2 supplement',
    image: '/protocol/decision/empty.webp',
  },
  {
    title: 'Hit 1–1.6 g/kg protein daily',
    image: '/protocol/decision/healthy-food.webp',
  },
  {
    title: 'Lift weights 4x week',
    image: '/protocol/decision/woman-workout.webp',
  },
];

export const YouDecideStep = () => {
  const { next } = useProtocolStepperContext();

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  // Create multiple copies for seamless infinite scroll
  const infiniteSteps = [...MOCK_STEPS, ...MOCK_STEPS, ...MOCK_STEPS];
  const ITEM_HEIGHT = 72; // 64px item + 8px gap
  const CHECKBOX_HEIGHT = 70; // Exact height for checkbox items
  const VISIBLE_ITEMS = 4; // Number of visible items
  const CONTAINER_HEIGHT = VISIBLE_ITEMS * ITEM_HEIGHT;
  const singleSetHeight = MOCK_STEPS.length * ITEM_HEIGHT;

  return (
    <ProtocolStepLayout>
      <div className="media-organic-reveal flex w-full flex-1 items-center">
        <div
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            height: `${CONTAINER_HEIGHT}px`,
          }}
          className="relative flex w-full items-start gap-4 overflow-hidden"
        >
          <div className="relative flex flex-1 flex-col items-center justify-center">
            <m.div
              className="flex flex-col gap-2 will-change-transform"
              animate={{
                y: [0, -singleSetHeight],
              }}
              transition={{
                duration: 12,
                ease: 'linear',
                repeat: Infinity,
              }}
              initial={{ y: 0 }}
            >
              {infiniteSteps.map((step, index) => (
                <div
                  key={`${index}-${step.title}`}
                  className="flex w-full shrink-0 items-center justify-start gap-4 overflow-hidden rounded-2xl border border-zinc-100 bg-white px-1 pr-4 shadow-xl shadow-black/[.03]"
                  style={{ height: `${ITEM_HEIGHT - 8}px` }}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="shrink-0 rounded-xl object-cover"
                    style={{ width: '56px', height: '56px' }}
                  />
                  <Body1 className="min-w-0 flex-1">{step.title}</Body1>
                </div>
              ))}
            </m.div>
          </div>
          <div className="relative flex shrink-0 flex-col items-center justify-center">
            <m.div
              className="flex flex-col will-change-transform"
              animate={{
                y: [0, -singleSetHeight],
              }}
              transition={{
                duration: 12,
                ease: 'linear',
                repeat: Infinity,
              }}
              initial={{ y: 0 }}
            >
              {infiniteSteps.map((step, index) => {
                const isChecked = index % 2 === 0;
                const bgColor = isChecked ? 'bg-vermillion-900' : 'bg-white';

                return (
                  <div
                    className="flex shrink-0 flex-col items-center justify-center"
                    key={`check-${index}-${step.title}`}
                    style={{ height: `${CHECKBOX_HEIGHT}px` }}
                  >
                    <div className="w-px flex-1 border-r border-dashed border-zinc-200" />
                    <div
                      className={`flex size-6 items-center justify-center rounded-lg border border-black/10 ${bgColor}`}
                    >
                      {isChecked && <Check className="size-4 text-white" />}
                    </div>
                    <div className="w-px flex-1 border-r border-dashed border-zinc-200" />
                  </div>
                );
              })}
            </m.div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <H2 className="mb-2 text-balance">
          You decide how you run your protocol
        </H2>
        <Body1 className="text-secondary">
          We surface recommendations but ultimately you decide what you want to
          add to your protocol.
        </Body1>
      </div>

      <Button onClick={handleNext}>Next</Button>
    </ProtocolStepLayout>
  );
};
