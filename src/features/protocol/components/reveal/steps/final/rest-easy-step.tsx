import { IconMedicinePill } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconMedicinePill';
import { IconSearchMenu } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconSearchMenu';
import { IconTargetArrow } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconTargetArrow';
import { m } from 'framer-motion';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Body1, H2 } from '@/components/ui/typography';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';

import { ProtocolStepLayout } from '../../../layouts/protocol-step-layout';

const MOCK_REASSURANCES = [
  {
    id: 'testing',
    text: "Never worry if you're testing the right things",
    icon: IconSearchMenu,
  },
  {
    id: 'supplements',
    text: "No need to check if you're taking the right supplements",
    icon: IconMedicinePill,
  },
  {
    id: 'progress',
    text: 'Know if your actions are moving the needle',
    icon: IconTargetArrow,
  },
];

export const RestEasyStep = () => {
  const { next } = useProtocolStepperContext();

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  return (
    <ProtocolStepLayout fullWidth>
      <div className="mx-auto w-full max-w-xl md:rounded-mask">
        <img
          src="/protocol/final/friends-outdoors.webp"
          alt="Friends in the field"
          className="media-organic-reveal max-h-96 w-full object-cover object-top"
        />
      </div>
      <m.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col px-4"
      >
        <div className="mb-4 text-center">
          <H2>Rest easy.</H2>
          <H2>We&apos;re in this with you.</H2>
        </div>

        <div className="mx-auto w-full max-w-md space-y-6">
          {MOCK_REASSURANCES.map((item, index) => (
            <m.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: 'easeOut',
              }}
              className="flex items-center gap-4"
            >
              <div className="flex size-6 items-center justify-center rounded-full bg-vermillion-500/20">
                <item.icon className="size-4 text-vermillion-900" />
              </div>
              <Body1 className="flex-1 text-zinc-900">{item.text}</Body1>
            </m.div>
          ))}
        </div>
      </m.div>

      <div className="mx-auto flex w-full max-w-md flex-col justify-center gap-4 px-4">
        <Button className="w-full" onClick={handleNext}>
          Continue
        </Button>
      </div>
    </ProtocolStepLayout>
  );
};
