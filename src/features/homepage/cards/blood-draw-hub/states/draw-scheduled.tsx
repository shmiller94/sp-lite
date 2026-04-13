import { Calendar, ChevronDown, FileText, MapPin } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Body1, Body2, H3 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { ScheduledData } from '../mock-data';

interface DrawScheduledProps {
  data: ScheduledData;
}

export const DrawScheduled = ({ data }: DrawScheduledProps) => {
  const [showPrep, setShowPrep] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Body2 className="mb-1 text-zinc-500">{data.panelName}</Body2>
        <H3 className="text-2xl font-normal">
          Your blood draw is in {data.daysUntil} day
          {data.daysUntil !== 1 ? 's' : ''}
        </H3>
      </div>

      {/* Details */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 size-5 shrink-0 text-zinc-500" />
            <div>
              <Body1 className="font-medium text-zinc-900">{data.date}</Body1>
              <Body2 className="text-zinc-600">{data.time}</Body2>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-zinc-500" />
            <div>
              <Body1 className="font-medium text-zinc-900">
                {data.location}
              </Body1>
              <Body2 className="text-zinc-600">{data.address}</Body2>
            </div>
          </div>
        </div>

        {/* Requisition CTA */}
        <div className="mt-5">
          <Button variant="outline" size="medium" className="w-full gap-2">
            <FileText className="size-4" />
            View Requisition PDF
          </Button>
        </div>
      </div>

      {/* Prep Tips - Expandable */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setShowPrep(!showPrep)}
          className="flex w-full items-center justify-between p-5"
        >
          <Body1 className="font-medium text-zinc-900">
            Preparation instructions
          </Body1>
          <ChevronDown
            className={cn(
              'size-5 text-zinc-400 transition-transform duration-200',
              showPrep && 'rotate-180',
            )}
          />
        </button>
        {showPrep && (
          <div className="space-y-4 border-t border-zinc-100 px-5 pb-5 pt-4">
            {data.prepTips.map((tip) => (
              <div key={tip.title}>
                <Body2 className="font-medium text-zinc-900">{tip.title}</Body2>
                <Body2 className="mt-0.5 text-zinc-600">
                  {tip.description}
                </Body2>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
