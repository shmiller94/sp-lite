import { ScoreChartConfig } from './types/score-chart-config';

/**
 * In most cases it'll be enough to adjust the values in this config.
 * If an adjustment in the chart business logic is needed, go into the `use-category-donut-chart.ts` file.
 */

export const CHART_CONFIG = {
  DEFAULT_SIZE: 120,
  OUTER_RADIUS_FACTOR: 0.4,
  INNER_RADIUS_FACTOR: 0.392,
  EXPANDED_OUTER_RADIUS_FACTOR: 0.4,
  EXPANDED_INNER_RADIUS_FACTOR: 0.333,
  GAP_ANGLE: 6,
  STROKE_WIDTH: 2.5,
  TOOLTIP_OFFSET_RADIUS_FACTOR: 0.417,
  ANIMATION_DURATION: 500,
  COOLDOWN_TIMEOUT: 300,
  LARGE_CHART_THRESHOLD: 120,
} as const satisfies ScoreChartConfig;
