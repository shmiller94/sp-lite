import { IconExposure1 } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconExposure1';
import { IconLab } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconLab';
import { IconLaw } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconLaw';
import { IconShieldCrossed } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconShieldCrossed';
import { m } from 'framer-motion';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Body1, Body2, H2 } from '@/components/ui/typography';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';

import { ProtocolStepLayout } from '../../../layouts/protocol-step-layout';

const MOCK_KEY_ISSUES = [
  {
    id: 'insufficient-dosage',
    title: 'Insufficient Dosage',
    description:
      'For example, many Vitamin D supplements have 300 IUs but you may need 3000.',
    icon: IconLaw,
  },
  {
    id: 'wrong-forms',
    title: 'Wrong Forms',
    description:
      'For example, most supplements have the wrong form of folate, B12 etc.',
    icon: IconLab,
  },
  {
    id: 'no-cofactors',
    title: 'No co-factors',
    description:
      'You need copper to absorb zinc, and vitamin K to absorb vitamin D etc.',
    icon: IconExposure1,
  },
  {
    id: 'harmful-additives',
    title: 'Harmful additives',
    description: 'e.g. silicon, titanium, magnesium stearate',
    icon: IconShieldCrossed,
  },
];

export const BenefitsStep = () => {
  const { next } = useProtocolStepperContext();

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  return (
    <ProtocolStepLayout fullWidth className="px-4">
      <m.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto w-full max-w-md"
      >
        <div className="mb-8">
          <H2 className="mb-2">Superpower helps you avoid these key issues</H2>
          <Body1 className="text-secondary">
            Regardless of whether you buy from us.
          </Body1>
        </div>

        <div className="mx-auto w-full max-w-md space-y-4 rounded-3xl bg-white p-4 shadow-xl shadow-black/[.03]">
          {MOCK_KEY_ISSUES.map((issue, index) => (
            <m.div
              key={issue.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex size-6 items-center justify-center rounded-full bg-vermillion-900/20">
                  <issue.icon className="size-4 text-vermillion-900" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-900">{issue.title}</h3>
                  <Body2 className="text-secondary">{issue.description}</Body2>
                </div>
              </div>
              {index < MOCK_KEY_ISSUES.length - 1 && (
                <hr className="my-4 ml-auto w-[calc(100%-2.5rem)] border-t border-t-zinc-200" />
              )}
            </m.div>
          ))}
        </div>
      </m.div>

      <div className="mx-auto flex w-full max-w-md flex-col justify-center gap-4">
        <Button className="w-full" onClick={handleNext}>
          Continue
        </Button>
      </div>
    </ProtocolStepLayout>
  );
};
