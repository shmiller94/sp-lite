import { Circle } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { Body2 } from '@/components/ui/typography';
import { STATUS_TO_COLOR } from '@/const/status-to-color';
import { useBiomarkers } from '@/features/biomarkers/api';
import { BiomarkerTableDialogRow } from '@/features/biomarkers/components/biomarkers-data-table/biomarker-table-dialog-row';
import { BiomarkerSparklineChart } from '@/features/biomarkers/components/charts/biomarker-sparkline-chart';
import { BiomarkerRange } from '@/features/biomarkers/components/range';
import { cn } from '@/lib/utils';

export type PlanObservationProps = {
  id: string;
  className?: string;
};

export function PlanGoalObservation({ id, className }: PlanObservationProps) {
  const { data, isLoading } = useBiomarkers();

  if (isLoading) {
    return <Skeleton className="h-[82px] w-full rounded-[20px]" />;
  }

  if (!data) return null;

  const biomarker = data.biomarkers.find((b) =>
    b.value.some((v) => v.id.toString() === id.toString()),
  );

  if (!biomarker) return null;

  const { status, name } = biomarker;

  return (
    <BiomarkerTableDialogRow biomarker={biomarker}>
      <div
        className={cn(
          'flex bg-white h-20 transition-all hover:bg-zinc-50 grow items-center justify-between rounded-2xl border border-zinc-200 shadow shadow-black/[0.025] py-2.5 pl-6 pr-3 hover:cursor-pointer',
          className,
        )}
      >
        <div className="flex w-1/2 flex-col items-start">
          <div className="flex flex-col justify-start gap-1">
            <div className="flex items-center gap-2.5">
              <Circle
                className="size-2 min-w-2 md:hidden"
                style={{
                  fill: STATUS_TO_COLOR[
                    status.toLowerCase() as keyof typeof STATUS_TO_COLOR
                  ],
                }}
                strokeWidth={0}
              />
              <Body2 className="line-clamp-1 max-w-[200px]">{name}</Body2>
            </div>
          </div>
        </div>

        <div className="flex w-1/2 items-center justify-end md:justify-between">
          <BiomarkerRange
            biomarker={biomarker}
            className="hidden rounded-lg px-2 py-1.5 text-xs md:block"
          />
          <BiomarkerSparklineChart
            biomarker={biomarker}
            className="h-full sm:ml-0"
            height={44}
            markerRadius={8}
            markerLineWidth={1}
          />
        </div>
      </div>
    </BiomarkerTableDialogRow>
  );
}
