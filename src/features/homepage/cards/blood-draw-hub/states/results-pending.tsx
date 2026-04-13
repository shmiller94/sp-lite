import { Check, Clock } from 'lucide-react';

import { Body1, Body2, H3 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { ResultsPendingData } from '../mock-data';

interface ResultsPendingProps {
  data: ResultsPendingData;
}

const STEPS = ['received', 'processing', 'ready'] as const;

const STEP_LABELS: Record<(typeof STEPS)[number], string> = {
  received: 'Sample Received',
  processing: 'Processing',
  ready: 'Results Ready',
};

const getStepIndex = (step: ResultsPendingData['currentStep']): number =>
  STEPS.indexOf(step);

export const ResultsPending = ({ data }: ResultsPendingProps) => {
  const currentIndex = getStepIndex(data.currentStep);
  const typeSuffix =
    data.panelType === 'baseline'
      ? '(10-day escalation)'
      : '(14-day escalation)';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Body2 className="mb-1 text-zinc-500">{data.panelName}</Body2>
        <H3 className="text-2xl font-normal">
          Results typically arrive in 5-7 days
        </H3>
        <Body2 className="mt-1 text-zinc-400">{typeSuffix}</Body2>
      </div>

      {/* Progress tracker */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        {/* Step labels */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => {
            const isComplete = i <= currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <div key={step} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full',
                    isComplete
                      ? 'bg-vermillion-600 text-white'
                      : 'bg-zinc-100 text-zinc-400',
                    isCurrent && 'ring-2 ring-vermillion-200',
                  )}
                >
                  {isComplete && i < currentIndex ? (
                    <Check className="size-4" />
                  ) : (
                    <span className="text-xs font-medium">{i + 1}</span>
                  )}
                </div>
                <Body2
                  className={cn(
                    'text-center text-xs font-medium',
                    isComplete ? 'text-vermillion-600' : 'text-zinc-400',
                  )}
                >
                  {STEP_LABELS[step]}
                </Body2>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="relative mt-4 h-1 w-full overflow-hidden rounded-full bg-zinc-200">
          <div
            className={cn(
              'absolute left-0 top-0 h-full rounded-full bg-vermillion-600 transition-all duration-500',
              currentIndex === 0 && 'w-[16%]',
              currentIndex === 1 && 'w-[50%]',
              currentIndex === 2 && 'w-full',
            )}
          />
        </div>

        <Body2 className="mt-4 text-center text-zinc-600">
          We will notify you the moment results arrive.
        </Body2>
      </div>

      {/* Escalation timeline */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <Body1 className="mb-4 font-medium text-zinc-900">
          Communication timeline
        </Body1>
        <div className="space-y-3">
          {data.escalationSteps.map((step) => (
            <div key={step.day} className="flex items-start gap-3">
              <div
                className={cn(
                  'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full',
                  step.reached
                    ? 'bg-green-100 text-green-600'
                    : 'bg-zinc-100 text-zinc-400',
                )}
              >
                {step.reached ? (
                  <Check className="size-3" />
                ) : (
                  <Clock className="size-3" />
                )}
              </div>
              <div>
                <Body2 className="font-medium text-zinc-900">
                  Day {step.day} - {step.date}
                </Body2>
                <Body2 className="text-zinc-600">{step.label}</Body2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
