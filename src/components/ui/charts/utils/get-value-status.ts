import { STATUS_TO_COLOR } from '@/const/status-to-color';

import { ChartDimensions } from '../types/chart';

export const getValueStatus = (
  dimensions: ChartDimensions,
  val: number,
): keyof typeof STATUS_TO_COLOR => {
  const hasNormalRange =
    dimensions.normalLow !== dimensions.optimalLow ||
    dimensions.normalHigh !== dimensions.optimalHigh;

  if (val >= dimensions.optimalLow && val < dimensions.optimalHigh) {
    return 'optimal';
  }

  if (hasNormalRange) {
    const maxRangeHigh = Math.max(
      dimensions.normalHigh,
      dimensions.optimalHigh,
    );
    const minRangeLow = Math.min(dimensions.normalLow, dimensions.optimalLow);

    if (val > maxRangeHigh) {
      return 'high';
    }

    if (val < minRangeLow) {
      return 'low';
    }

    if (val > dimensions.normalLow && val < dimensions.normalHigh) {
      return 'normal';
    }
  }

  return val < dimensions.optimalLow ? 'low' : 'high';
};
