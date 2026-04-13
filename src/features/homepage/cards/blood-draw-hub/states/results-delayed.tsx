import { AlertTriangle, Check, Clock } from 'lucide-react';

import { Body1, Body2, H3 } from '@/components/ui/typography';

import { ResultsDelayedData } from '../mock-data';

interface ResultsDelayedProps {
  data: ResultsDelayedData;
}

export const ResultsDelayed = ({ data }: ResultsDelayedProps) => {
  return (
    <div className="space-y-6">
      {/* Amber alert banner */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div>
            <Body1 className="font-medium text-amber-900">
              Your {data.panelName} is taking longer than expected
            </Body1>
            <Body2 className="mt-1 text-amber-800">
              Labs sometimes need to rerun samples. Our team is actively
              following up with the lab. We will notify you the moment results
              arrive.
            </Body2>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center">
        <H3 className="text-xl font-normal">
          Next follow-up: {data.nextFollowUpDate}
        </H3>
      </div>

      {/* Progress tracker - stuck at processing */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Step 1: Received - complete */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-vermillion-600 text-white">
              <Check className="size-4" />
            </div>
            <Body2 className="text-center text-xs font-medium text-vermillion-600">
              Sample Received
            </Body2>
          </div>

          {/* Step 2: Processing - current with delay indicator */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-amber-500 text-white ring-2 ring-amber-200">
              <Clock className="size-4" />
            </div>
            <Body2 className="text-center text-xs font-medium text-amber-600">
              Processing (Delayed)
            </Body2>
          </div>

          {/* Step 3: Results Ready - not reached */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
              <span className="text-xs font-medium">3</span>
            </div>
            <Body2 className="text-center text-xs font-medium text-zinc-400">
              Results Ready
            </Body2>
          </div>
        </div>

        {/* Progress bar with amber color for delay */}
        <div className="relative mt-4 h-1 w-full overflow-hidden rounded-full bg-zinc-200">
          <div className="absolute left-0 top-0 h-full w-[50%] rounded-full bg-amber-500 transition-all duration-500" />
        </div>
      </div>

      {/* Escalation history */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <Body1 className="mb-4 font-medium text-zinc-900">
          Communication history
        </Body1>
        <div className="space-y-3">
          {data.escalationSteps.map((step) => (
            <div key={step.day} className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Check className="size-3" />
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
