import React from 'react';

import { SparkLineChart } from '@/components/ui/sparkline-chart';
import { Biomarker } from '@/types/api';

export interface BiomarkerSparklineChartProps {
  biomarker: Biomarker;
}

export function BiomarkerSparklineChart({
  biomarker,
}: BiomarkerSparklineChartProps): JSX.Element {
  return (
    <div className={biomarker.value.length > 0 ? '' : 'opacity-30'}>
      <SparkLineChart
        data={biomarker.value}
        unit={biomarker.unit}
        ranges={biomarker.range}
        status={biomarker.status}
      />
    </div>
  );
}
