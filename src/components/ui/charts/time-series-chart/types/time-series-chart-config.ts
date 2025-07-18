export interface TimeSeriesChartConfig {
  /**
   * The default height of the SVG container in pixels
   */
  SVG_HEIGHT: number;

  /**
   * The minimum height of the SVG container in pixels to ensure readability
   */
  SVG_MIN_HEIGHT: number;

  /**
   * General padding around the chart content in pixels (fallback value)
   */
  PADDING: number;

  /**
   * Left padding for Y-axis labels and chart spacing in pixels
   */
  LEFT_PADDING: number;

  /**
   * Right padding for chart spacing in pixels
   */
  RIGHT_PADDING: number;

  /**
   * Top padding for chart spacing and title area in pixels
   */
  TOP_PADDING: number;

  /**
   * Bottom padding for X-axis labels and legend area in pixels
   */
  BOTTOM_PADDING: number;

  /**
   * Radius of data point circles in pixels
   */
  CIRCLE_RADIUS: number;

  /**
   * Width of the line stroke connecting data points in pixels
   */
  STROKE_WIDTH: number;

  /**
   * Factor used to extend the Y-axis range beyond min/max values for better visualization
   * Value of 0.1 means 10% extension on both ends
   */
  RANGE_EXTENSION_FACTOR: number;

  /**
   * Number of data points to display per page on mobile devices
   */
  ITEMS_PER_PAGE_MOBILE: number;

  /**
   * Number of data points to display per page on desktop devices
   */
  ITEMS_PER_PAGE_DESKTOP?: number;
}
