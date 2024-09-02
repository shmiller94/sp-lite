import { SparklineChartLegendBuilder } from './sparkline-chart-builder';

export interface SparklineChartLegendProps {
  min: number;
  max: number;
  dark?: boolean;
  ranges: any;
  data: any;
}

export const SparkLineChartLegend = (props: SparklineChartLegendProps) => {
  const builder = new SparklineChartLegendBuilder(props.ranges, props.data);

  return builder.buildLegend();
};
