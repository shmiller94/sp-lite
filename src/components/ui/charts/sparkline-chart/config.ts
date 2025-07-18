import type { SparklineChartConfig } from './types/sparkline-chart-config';

/**
 * In most cases it'll be enough to adjust the values in this config.
 * If an adjustment in the chart business logic is needed, go into the `use-sparkline-chart.ts` file.
 */

export const CHART_CONFIG = {
  SVG_HEIGHT: 64,
  SVG_WIDTH_MOBILE: 125,
  SVG_WIDTH_DESKTOP: 150,
  PADDING: 8,
  RANGE_EXTENSION_FACTOR: 0.1,
  CIRCLE_RADIUS: 5,
  STROKE_WIDTH: 2,
  TOOLTIP_OFFSET: 40,
} as const satisfies SparklineChartConfig;
