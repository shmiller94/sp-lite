import { BiomarkerResult } from '@/types/api';

import { ChartPoint } from '../types/chart';

export function toChartPoint(result: BiomarkerResult): ChartPoint {
  return {
    x: new Date(result.timestamp).getTime(),
    y: result.quantity.value,
    isPlaceholder: false,
  };
}
