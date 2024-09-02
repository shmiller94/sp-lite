import { TimeSeriesChart } from '@/components/ui/time-series-chart';
import { Biomarker } from '@/types/api';

export interface BiomarkerTimeSeriesChartProps {
  biomarker: Biomarker;
}

export function BiomarkerTimeSeriesChart({
  biomarker,
}: BiomarkerTimeSeriesChartProps): JSX.Element {
  return <TimeSeriesChart biomarker={biomarker} />;
}
