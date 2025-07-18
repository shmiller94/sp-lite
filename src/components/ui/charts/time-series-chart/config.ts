import type { TimeSeriesChartConfig } from './types/time-series-chart-config';

/**
 * In most cases it'll be enough to adjust the values in this config.
 * If an adjustment in the chart business logic is needed, go into the `use-time-series-chart.ts` file.
 */

export const CHART_CONFIG = {
  SVG_HEIGHT: 300,
  SVG_MIN_HEIGHT: 256,
  PADDING: 40,
  LEFT_PADDING: 80,
  RIGHT_PADDING: 80,
  TOP_PADDING: 40,
  BOTTOM_PADDING: 60,
  CIRCLE_RADIUS: 4,
  STROKE_WIDTH: 2,
  RANGE_EXTENSION_FACTOR: 0.1,
  ITEMS_PER_PAGE_MOBILE: 4,
  ITEMS_PER_PAGE_DESKTOP: 15,
} as const satisfies TimeSeriesChartConfig;
