export interface ScoreChartConfig {
  /**
   * Default size of the chart in pixels
   */
  DEFAULT_SIZE: number;

  /**
   * Factor for calculating the outer radius of the chart
   */
  OUTER_RADIUS_FACTOR: number;

  /**
   * Factor for calculating the inner radius of the chart
   */
  INNER_RADIUS_FACTOR: number;

  /**
   * Factor for calculating the expanded outer radius of the chart
   */
  EXPANDED_OUTER_RADIUS_FACTOR: number;

  /**
   * Factor for calculating the expanded inner radius of the chart
   */
  EXPANDED_INNER_RADIUS_FACTOR: number;

  /**
   * Gap angle between chart segments in degrees
   */
  GAP_ANGLE: number;

  /**
   * Width of the stroke/border in pixels
   */
  STROKE_WIDTH: number;

  /**
   * Factor for calculating tooltip offset radius
   */
  TOOLTIP_OFFSET_RADIUS_FACTOR: number;

  /**
   * Duration of animations in milliseconds
   */
  ANIMATION_DURATION: number;

  /**
   * Cooldown timeout between interactions in milliseconds
   */
  COOLDOWN_TIMEOUT: number;

  /**
   * Threshold size for determining if chart is considered "large"
   */
  LARGE_CHART_THRESHOLD: number;
}
