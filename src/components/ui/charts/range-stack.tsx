import { STATUS_TO_COLOR } from '@/const/status-to-color';
import { Range } from '@/types/api';

import { ChartDimensions } from './types/chart';
import {
  calculateChartDimensions,
  convertValueToY,
} from './utils/chart-dimensions';

const CHART_CONFIG = {
  SVG_HEIGHT: 64,
  PADDING: 8,
  RANGE_EXTENSION_FACTOR: 0.2,
  SEGMENT_GAP: 0.5,
  VERTICAL_WIDTH: 3,
} as const;

interface RangeSegment {
  y: number;
  height: number;
  color: string;
}

const getVerticalSegments = (
  dimensions: ChartDimensions,
  valueToY: (val: number) => number,
  svgHeight: number,
  padding: number,
  segmentGap: number,
): RangeSegment[] => {
  const segments: RangeSegment[] = [];
  const {
    chartMaxValue,
    normalHigh,
    optimalHigh,
    optimalLow,
    normalLow,
    chartMinValue,
  } = dimensions;

  const hasNormalRange = normalLow !== optimalLow || normalHigh !== optimalHigh;

  const getY = (value: number) =>
    (valueToY(value) / 100) * (svgHeight - 2 * padding) + padding;

  if (hasNormalRange) {
    const ranges = [];

    const maxValue = Math.max(normalHigh, optimalHigh);
    const minValue = Math.min(normalLow, optimalLow);

    if (chartMaxValue > maxValue) {
      ranges.push({
        from: chartMaxValue,
        to: maxValue,
        color: STATUS_TO_COLOR.high,
      });
    }

    if (normalHigh > optimalHigh) {
      ranges.push({
        from: normalHigh,
        to: optimalHigh,
        color: STATUS_TO_COLOR.normal,
      });
    }

    ranges.push({
      from: optimalHigh,
      to: optimalLow,
      color: STATUS_TO_COLOR.optimal,
    });

    if (normalLow < optimalLow) {
      ranges.push({
        from: optimalLow,
        to: normalLow,
        color: STATUS_TO_COLOR.normal,
      });
    }

    if (chartMinValue < minValue) {
      ranges.push({
        from: minValue,
        to: chartMinValue,
        color: STATUS_TO_COLOR.low,
      });
    }

    let currentY = padding;
    ranges.forEach((range) => {
      const fromY = getY(range.from);
      const toY = getY(range.to);
      const startY = Math.max(currentY, fromY) + segmentGap / 2;
      const height = Math.max(0, toY - startY - segmentGap);

      if (height > 0) {
        segments.push({
          y: startY,
          height,
          color: range.color,
        });
        currentY = toY + segmentGap;
      }
    });
  } else {
    let currentY = padding;

    if (chartMaxValue > optimalHigh) {
      const optimalHighY = getY(optimalHigh);
      const height = Math.max(0, optimalHighY - currentY - segmentGap);
      if (height > 0) {
        segments.push({
          y: currentY,
          height,
          color: STATUS_TO_COLOR.high,
        });
        currentY = optimalHighY + segmentGap;
      }
    }

    const optimalHighY = getY(optimalHigh);
    const optimalLowY = getY(optimalLow);
    const optimalStartY = Math.max(currentY, optimalHighY) + segmentGap / 2;
    const optimalHeight = Math.max(0, optimalLowY - optimalStartY - segmentGap);
    if (optimalHeight > 0) {
      segments.push({
        y: optimalStartY,
        height: optimalHeight,
        color: STATUS_TO_COLOR.optimal,
      });
      currentY = optimalLowY + segmentGap;
    }

    if (chartMinValue < optimalLow) {
      const height = Math.max(0, svgHeight - padding - currentY - segmentGap);
      if (height > 0) {
        segments.push({
          y: currentY,
          height,
          color: STATUS_TO_COLOR.low,
        });
      }
    }
  }

  return segments.filter((segment) => segment.height > 0);
};

export interface RangeStackProps {
  range: Range[];
  values: number[];
  height?: number;
  padding?: number;
  dimensions?: ChartDimensions;
  rangeExtensionFactor?: number;
}

// renders range stack (vertical lines) to represent the ranges. It also takes the values into consideration as out-of-range isn't defined in the range object.
export const RangeStack = ({
  range,
  values,
  height,
  padding,
  dimensions: providedDimensions,
  rangeExtensionFactor,
}: RangeStackProps) => {
  const svgHeight = height ?? CHART_CONFIG.SVG_HEIGHT;
  const svgPadding = padding ?? CHART_CONFIG.PADDING;
  const extensionFactor =
    rangeExtensionFactor ?? CHART_CONFIG.RANGE_EXTENSION_FACTOR;

  const dimensions =
    providedDimensions ??
    calculateChartDimensions(range, values, extensionFactor);
  const valueToY = (val: number) => convertValueToY(dimensions, val);
  const segments = getVerticalSegments(
    dimensions,
    valueToY,
    svgHeight,
    svgPadding,
    CHART_CONFIG.SEGMENT_GAP,
  );

  if (!segments.length) return null;

  return (
    <svg
      width={CHART_CONFIG.VERTICAL_WIDTH}
      height={svgHeight}
      className="overflow-visible"
    >
      {segments.map((segment, index) => (
        <rect
          key={index}
          x={0}
          y={segment.y}
          width={CHART_CONFIG.VERTICAL_WIDTH}
          height={segment.height}
          fill={segment.color}
          rx={CHART_CONFIG.VERTICAL_WIDTH / 2}
        />
      ))}
    </svg>
  );
};
