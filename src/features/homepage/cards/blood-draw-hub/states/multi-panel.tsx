import { AlertCircle, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Body1, Body2, H3 } from '@/components/ui/typography';

import { MultiPanelData } from '../mock-data';

interface MultiPanelProps {
  data: MultiPanelData;
}

export const MultiPanel = ({ data }: MultiPanelProps) => {
  const topPanel = data.panels[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <H3 className="text-2xl font-normal">Which panel to complete first</H3>
        <Body2 className="mt-2 text-zinc-500">
          Based on your biomarker history, here is the recommended order.
        </Body2>
      </div>

      {/* Panel list */}
      <div className="space-y-3">
        {data.panels.map((panel) => (
          <div
            key={panel.panelName}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-2 flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white">
                {panel.priority}
              </div>
              <Body1 className="font-medium text-zinc-900">
                {panel.panelName}
              </Body1>
            </div>

            <Body2 className="text-zinc-600">{panel.reason}</Body2>

            {panel.biomarkerFlag && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2">
                <AlertCircle className="size-4 shrink-0 text-amber-600" />
                <Body2 className="text-sm text-amber-800">
                  {panel.biomarkerFlag.name}: {panel.biomarkerFlag.value}{' '}
                  {panel.biomarkerFlag.unit} - {panel.biomarkerFlag.note}
                </Body2>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      {topPanel && (
        <Button variant="default" size="medium" className="w-full gap-2">
          Schedule {topPanel.panelName}
          <ArrowRight className="size-4" />
        </Button>
      )}
    </div>
  );
};
