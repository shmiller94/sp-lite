import { Range } from '@/types/api';

import { ChartDimensions } from '../types/chart';

import {
  getBinaryBiomarkerDimensions,
  isBinaryBiomarker,
} from './binary-biomarker';

// calculates the dimensions of the chart, including the min and max values, the total range, and the optimal and normal ranges
export const calculateChartDimensions = (
  range: Range[],
  values: number[],
  rangeExtensionFactor: number,
): ChartDimensions => {
  if (!values.length || values.some((v) => !isFinite(v))) {
    return {
      minValue: 0,
      maxValue: 100,
      chartMinValue: 0,
      chartMaxValue: 100,
      totalRange: 100,
      optimalLow: 0,
      optimalHigh: 100,
      normalLow: 0,
      normalHigh: 100,
    };
  }

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const optimalRange = range?.find((r) => r.status === 'OPTIMAL');
  const normalRange = range?.find((r) => r.status === 'NORMAL');

  // Binary biomarkers: use forced ranges (-1..1.1 with optimal 0..1.1)
  if (isBinaryBiomarker(optimalRange, normalRange)) {
    return getBinaryBiomarkerDimensions(minValue, maxValue);
  }

  if (!optimalRange) {
    const totalRange = maxValue - minValue || 1;
    return {
      minValue,
      maxValue,
      chartMinValue: minValue,
      chartMaxValue: maxValue,
      totalRange,
      optimalLow: minValue,
      optimalHigh: maxValue,
      normalLow: minValue,
      normalHigh: maxValue,
    };
  }

  let optimalLow: number;
  let optimalHigh: number;

  if (
    optimalRange.low?.value !== undefined &&
    optimalRange.high?.value !== undefined
  ) {
    optimalLow = optimalRange.low.value;
    optimalHigh = optimalRange.high.value;
  } else if (
    optimalRange.low?.value !== undefined &&
    optimalRange.high?.value === undefined
  ) {
    optimalLow = optimalRange.low.value;
    optimalHigh = Math.max(maxValue, optimalLow * 2);
  } else if (
    optimalRange.low?.value === undefined &&
    optimalRange.high?.value !== undefined
  ) {
    optimalHigh = optimalRange.high.value;
    optimalLow = Math.min(minValue, optimalHigh * 0.5);
  } else {
    optimalLow = minValue;
    optimalHigh = maxValue;
  }

  if (!normalRange) {
    const rangeSpan = optimalHigh - optimalLow;
    const rangeExtension = rangeSpan * rangeExtensionFactor;
    const chartMinValue = Math.min(minValue, optimalLow - rangeExtension);
    const chartMaxValue = Math.max(maxValue, optimalHigh + rangeExtension);
    const totalRange = chartMaxValue - chartMinValue || 1;

    return {
      minValue,
      maxValue,
      chartMinValue,
      chartMaxValue,
      totalRange,
      optimalLow,
      optimalHigh,
      normalLow: optimalLow,
      normalHigh: optimalHigh,
    };
  }

  const normalLow = normalRange.low?.value ?? 0;
  const normalHigh = normalRange.high?.value ?? optimalHigh;

  const rangeExtension = (normalHigh - normalLow) * rangeExtensionFactor;
  const chartMinValue = Math.min(
    minValue,
    normalLow,
    optimalLow,
    normalLow - rangeExtension,
  );
  const chartMaxValue = Math.max(
    maxValue,
    normalHigh,
    optimalHigh,
    normalHigh + rangeExtension,
  );
  const totalRange = chartMaxValue - chartMinValue || 1;

  return {
    minValue,
    maxValue,
    chartMinValue,
    chartMaxValue,
    totalRange,
    optimalLow,
    optimalHigh,
    normalLow,
    normalHigh,
  };
};

// converts a value to a percentage of the total range, important for vertical positioning of the values
export const convertValueToY = (
  dimensions: ChartDimensions,
  val: number,
): number => {
  if (!isFinite(val) || dimensions.totalRange === 0) {
    return 50;
  }

  const percentage =
    ((val - dimensions.chartMinValue) / dimensions.totalRange) * 100;
  const result = 100 - percentage;

  return isFinite(result) ? result : 50;
};

// Maps a numeric value from one chart dimension to another by piecewise
export const mapValueAcrossDimensions = (
  value: number,
  from: ChartDimensions,
  to: ChartDimensions,
): number => {
  // Build monotonic breakpoint arrays for both spaces
  const fromMinLow = Math.min(from.normalLow, from.optimalLow);
  const fromMaxHigh = Math.max(from.normalHigh, from.optimalHigh);
  const toMinLow = Math.min(to.normalLow, to.optimalLow);
  const toMaxHigh = Math.max(to.normalHigh, to.optimalHigh);

  const fromPoints = [
    from.chartMinValue,
    fromMinLow,
    from.optimalLow,
    from.optimalHigh,
    fromMaxHigh,
    from.chartMaxValue,
  ];
  const toPoints = [
    to.chartMinValue,
    toMinLow,
    to.optimalLow,
    to.optimalHigh,
    toMaxHigh,
    to.chartMaxValue,
  ];

  // Handle degenerate cases
  if (!Number.isFinite(value)) return to.chartMinValue + to.totalRange / 2;
  if (from.chartMaxValue === from.chartMinValue) return to.chartMinValue;

  // Find source interval index i such that value in [from[i], from[i+1]]
  let i = 0;
  while (i < fromPoints.length - 2 && value > fromPoints[i + 1]) i += 1;

  const aFrom = fromPoints[i];
  const bFrom = fromPoints[i + 1];
  const aTo = toPoints[i];
  const bTo = toPoints[i + 1];

  const denom = bFrom - aFrom;
  const t = denom !== 0 ? (value - aFrom) / denom : 0;
  const mapped = aTo + t * (bTo - aTo);

  if (!Number.isFinite(mapped)) return to.chartMinValue + to.totalRange / 2;
  return Math.max(to.chartMinValue, Math.min(to.chartMaxValue, mapped));
};
