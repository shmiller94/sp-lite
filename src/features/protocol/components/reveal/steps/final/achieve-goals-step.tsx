import { m } from 'framer-motion';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Body1, Body2, H1, H3, H4 } from '@/components/ui/typography';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';

import { ProtocolStepLayout } from '../../../layouts/protocol-step-layout';

const MOCK_GOAL_ACTIONS = [
  {
    id: 'source-supplements',
    image: (
      <img
        className="w-64"
        src="/protocol/final/three-bottles.webp"
        alt="Supplements"
      />
    ),
    title: 'Source supplements',
    description:
      "We'll help you source supplements either with us or somewhere else.",
  },
  {
    id: 'remind-actions',
    image: (
      <img
        className="w-64"
        src="/protocol/final/girls-back.webp"
        alt="Key actions reminder"
      />
    ),
    title: 'Remind you about key actions',
    description: "We'll check in and remind you of your key activities.",
  },
  {
    id: 'retest-protocol',
    image: (
      <img
        className="w-64"
        src="/protocol/final/orange-panel.webp"
        alt="Testing kit"
      />
    ),
    title: 'Retest & adjust protocol',
    description:
      "We'll help you track your progress and retest to dial in your protocol.",
  },
];

export const AchieveGoalsStep = () => {
  const { next } = useProtocolStepperContext();

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  return (
    <ProtocolStepLayout>
      <m.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-4xl"
      >
        <div className="mb-8">
          <H3>How we will help you achieve your goals</H3>
          <Body1 className="text-secondary">
            So you can transform your health.
          </Body1>
        </div>
        <div className="flex flex-col gap-2">
          {MOCK_GOAL_ACTIONS.map((action, index) => (
            <m.div
              key={action.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
              className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow shadow-black/[.03]"
            >
              <H1 className="absolute left-4 top-3 bg-gradient-to-t from-vermillion-900 to-vermillion-500 bg-clip-text px-1 font-semibold text-transparent md:text-4xl">
                {index + 1}
              </H1>
              <m.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: 'easeOut',
                }}
                className="mb-6 flex w-full items-center justify-center"
              >
                {action.image}
              </m.div>
              <H4 className="mb-1 text-base">{action.title}</H4>
              <Body2 className="text-secondary">{action.description}</Body2>
            </m.div>
          ))}
        </div>
      </m.div>
      <div className="flex flex-col justify-center gap-4">
        <Button className="w-full" onClick={handleNext}>
          Continue
        </Button>
      </div>
    </ProtocolStepLayout>
  );
};
