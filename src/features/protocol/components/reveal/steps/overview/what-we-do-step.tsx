import { m } from 'framer-motion';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Body1, Body2, H1, H2, H4 } from '@/components/ui/typography';
import { Body4 } from '@/components/ui/typography/body4/body4';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';

import { ProtocolStepLayout } from '../../../layouts/protocol-step-layout';

const MOCK_OVERVIEW_ACTIONS = [
  {
    id: 'review-results',
    image: (
      <img
        className="w-56"
        src="/protocol/what-we-do/biomarkers.webp"
        alt="Biomarkers"
        style={{
          maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 75%, transparent 100%)',
        }}
      />
    ),
    title: 'Review Key Results',
    description:
      "We'll surface the biomarkers worth bringing to your attention.",
  },
  {
    id: 'build-protocol',
    image: (
      <img
        className="w-40"
        src="/protocol/what-we-do/protocols.webp"
        alt="Protocols"
        style={{
          maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 75%, transparent 100%)',
        }}
      />
    ),
    title: 'Build your protocol',
    description:
      "We'll turn your results into a clear, prioritized plan you can follow.",
  },
  {
    id: 'decide-run',
    image: (
      <img
        className="w-40"
        src="/protocol/what-we-do/woman-running.webp"
        alt="Woman Running"
        style={{
          maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 75%, transparent 100%)',
        }}
      />
    ),
    title: 'Decide how to run it',
    description:
      'Choose how to set up your protocol items. With Superpower or on your own.',
  },
];

export const WhatWeDoStep = () => {
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
        <div className="mb-8 flex flex-col items-center justify-center">
          <H2 className="text-center">Your protocol, in 3 steps</H2>
          <Body1 className="text-center text-secondary">
            Key biomarkers, a prioritized plan, and a simple way to run it.
          </Body1>
        </div>
        <div className="flex flex-col gap-2">
          {MOCK_OVERVIEW_ACTIONS.map((action, index) => (
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
                className="mb-8 flex w-full items-center justify-center"
              >
                {action.image}
              </m.div>
              <H4 className="mb-1 text-base">{action.title}</H4>
              <Body2 className="text-secondary">{action.description}</Body2>
            </m.div>
          ))}
        </div>
      </m.div>
      <div className="flex flex-col justify-center gap-6">
        <div className="flex flex-col justify-center gap-4">
          <Button className="w-full" onClick={handleNext}>
            Continue
          </Button>
        </div>
        <Body4 className="text-center text-xs text-zinc-400">
          Don&apos;t worry if you don&apos;t remember everything. Everything
          will be summarized in your dashboard.
        </Body4>
      </div>
    </ProtocolStepLayout>
  );
};
