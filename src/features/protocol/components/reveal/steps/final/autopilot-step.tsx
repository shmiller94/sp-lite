import { m } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Body2, H2, H3 } from '@/components/ui/typography';
import { ProtocolChart } from '@/features/protocol/components/protocol-chart';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';
import { formatMoney } from '@/utils/format-money';

import { ProtocolStepLayout } from '../../../layouts/protocol-step-layout';

const MOCK_BENEFITS = [
  {
    id: 'measures',
    text: 'Specifically measures TSH, LDL Cholesterol & Testosterone',
    icon: Check,
  },
  {
    id: 'reveals',
    text: 'Reveals changes in your health',
    icon: Check,
  },
  {
    id: 'creates',
    text: 'Creates an updated protocol with new data',
    icon: Check,
  },
];

export const AutopilotStep = () => {
  const { next } = useProtocolStepperContext();

  const handleUpgrade = useCallback(() => {
    next();
  }, [next]);

  const handleNoThanks = useCallback(() => {
    next();
  }, [next]);

  return (
    <ProtocolStepLayout>
      <m.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-2xl"
      >
        <H2 className="mb-4">
          Would you like to retest to see if you made progress?
        </H2>
        <ProtocolChart />
        <div className="mb-8">
          <H3 className="mb-6 text-lg">How we can see these results?</H3>

          <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow shadow-black/[.03]">
            <div className="flex items-center gap-4">
              <img
                src="/services/superpower_blood_panel.png"
                alt="Testing Panel"
                className="size-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-zinc-900">
                    Baseline Panel{' '}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="-translate-y-0.5 cursor-help">
                          <span className="text-zinc-500">
                            <Info className="inline-block size-4" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          Managed by your Autopilot
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">
                      {formatMoney(8900)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            {MOCK_BENEFITS.map((benefit) => (
              <div key={benefit.id} className="flex items-center gap-3">
                <div className="flex size-6 items-center justify-center rounded-full bg-vermillion-900/20">
                  <div className="flex size-4 items-center justify-center rounded-full bg-vermillion-900">
                    <benefit.icon
                      strokeWidth={2.5}
                      className="size-3 text-white"
                    />
                  </div>
                </div>
                <Body2 className="text-zinc-800">{benefit.text}</Body2>
              </div>
            ))}
          </div>
          <hr className="mb-4 border-zinc-200" />
          <div className="flex items-center justify-between rounded-lg bg-zinc-50">
            <div>
              <span className="text-lg font-bold text-zinc-900">
                Metabolic Panel
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400 line-through">
                {formatMoney(18000)}
              </span>
              <span className="text-base font-bold text-vermillion-900">
                {formatMoney(14900)}
              </span>
            </div>
          </div>
        </div>
      </m.div>

      <div className="flex flex-col gap-3">
        <Button className="w-full gap-2" onClick={handleUpgrade}>
          Upgrade to Autopilot
          <span className="text-zinc-500">{formatMoney(14900)}</span>
        </Button>
        <Button variant="outline" className="w-full" onClick={handleNoThanks}>
          No thank you
        </Button>
      </div>
    </ProtocolStepLayout>
  );
};
