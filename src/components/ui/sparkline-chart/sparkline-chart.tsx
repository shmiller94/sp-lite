import React from 'react';

import { SparkLineChartGraph } from './sparkline-chart-graph';
import { SparkLineChartLegend } from './sparkline-chart-legend';

export const SparkLineChart = (props: any) => {
  return (
    <div
      className="ml-auto flex h-[80px] w-full max-w-[110px] gap-1 xs:max-w-[170px] lg:max-w-[200px]"
      style={{
        WebkitMask:
          'linear-gradient(90deg, rgba(0,0,0,0) 20%, rgba(0,0,0,1) 30%)',
      }}
    >
      <SparkLineChartGraph {...props} />
      <SparkLineChartLegend {...props} />
    </div>
  );
};
