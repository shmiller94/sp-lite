import React from 'react';

import { SparkLineChart } from '@/components/ui/sparkline-chart';
import { cn } from '@/lib/utils';
import { Biomarker } from '@/types/api';

export interface BiomarkerSparklineChartProps {
  biomarker: Biomarker;
  className?: string;
}

export function BiomarkerSparklineChart({
  biomarker,
  className,
}: BiomarkerSparklineChartProps): JSX.Element {
  return (
    <div
      className={cn(biomarker.value.length > 0 ? '' : 'opacity-30', className)}
    >
      <SparkLineChart
        data={biomarker.value}
        unit={biomarker.unit}
        ranges={biomarker.range}
        status={biomarker.status}
      />
    </div>
  );
}
