import { AlertCircle, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Body1, Body2, H3 } from '@/components/ui/typography';

import { NeedsSchedulingData } from '../mock-data';

interface DrawNeedsSchedulingProps {
  data: NeedsSchedulingData;
}

export const DrawNeedsScheduling = ({ data }: DrawNeedsSchedulingProps) => {
  const topRecommendation = data.recommendations[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <H3 className="text-2xl font-normal">
          Your blood draw needs to be booked
        </H3>
      </div>

      {/* Biomarker-driven recommendations */}
      <div className="space-y-3">
        {data.recommendations.map((rec) => (
          <div
            key={rec.panelName}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-2 flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white">
                {rec.priority}
              </div>
              <Body1 className="font-medium text-zinc-900">
                {rec.panelName}
              </Body1>
            </div>

            <Body2 className="text-zinc-600">{rec.reason}</Body2>

            {rec.biomarkerFlag && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2">
                <AlertCircle className="size-4 shrink-0 text-amber-600" />
                <Body2 className="text-sm text-amber-800">
                  {rec.biomarkerFlag.name}: {rec.biomarkerFlag.value}{' '}
                  {rec.biomarkerFlag.unit} - {rec.biomarkerFlag.note}
                </Body2>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Primary CTA */}
      {topRecommendation && (
        <Button variant="default" size="medium" className="w-full gap-2">
          Schedule {topRecommendation.panelName}
          <ArrowRight className="size-4" />
        </Button>
      )}
    </div>
  );
};
