import { MiniScoreChartConfig } from './types/mini-donut-chart-config';

/**
 * In most cases it'll be enough to adjust the values in this config.
 * If an adjustment in the chart business logic is needed, go into the `use-category-donut-chart.ts` file.
 */

export const CHART_CONFIG = {
  SIZE: 24,
  STROKE_WIDTH: 2,
  ANIMATION_DURATION: 1000,
  ANIMATION_DELAY: 100,
  ANIMATION_EASE: 'ease-out',
  CATEGORY_VALUES: {
    A: 100,
    B: 66,
    C: 33,
    '-': 0,
  },
} as const satisfies MiniScoreChartConfig;
