export interface SparklineChartConfig {
  /**
   * The height of the SVG container in pixels
   */
  SVG_HEIGHT: number;

  /**
   * The width of the SVG container on mobile devices in pixels
   */
  SVG_WIDTH_MOBILE: number;

  /**
   * The width of the SVG container on desktop devices in pixels
   */
  SVG_WIDTH_DESKTOP: number;

  /**
   * Internal padding around the chart content in pixels
   */
  PADDING: number;

  /**
   * Factor used to extend the Y-axis range beyond min/max values for better visualization
   * Value of 0.1 means 10% extension on both ends
   */
  RANGE_EXTENSION_FACTOR: number;

  /**
   * Radius of data point circles in pixels
   */
  CIRCLE_RADIUS: number;

  /**
   * Width of the stroke/line in pixels
   */
  STROKE_WIDTH: number;

  /**
   * Vertical offset for tooltip positioning in pixels
   */
  TOOLTIP_OFFSET: number;
}
