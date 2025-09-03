export interface MiniScoreChartConfig {
  /**
   * Size of the mini chart in pixels
   */
  SIZE: number;

  /**
   * Width of the stroke/border in pixels
   */
  STROKE_WIDTH: number;

  /**
   * Duration of animations in milliseconds
   */
  ANIMATION_DURATION: number;

  /**
   * Delay before animation starts in milliseconds
   */
  ANIMATION_DELAY: number;

  /**
   * CSS easing function for animations
   */
  ANIMATION_EASE: string;

  /**
   * Mapping of category grades to their numeric values
   */
  CATEGORY_VALUES: {
    A: number;
    B: number;
    C: number;
    '-': number;
  };
}
