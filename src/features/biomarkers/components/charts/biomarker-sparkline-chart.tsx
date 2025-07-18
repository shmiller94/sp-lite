import { SparklineChart } from '@/components/ui/charts/sparkline-chart/sparkline-chart';
import { cn } from '@/lib/utils';
import { Biomarker } from '@/types/api';

export interface BiomarkerSparklineChartProps {
  biomarker: Biomarker;
  className?: string;
  height?: number;
  markerRadius?: number;
  markerLineWidth?: number;
}

export function BiomarkerSparklineChart({
  biomarker,
  className,
}: BiomarkerSparklineChartProps): JSX.Element {
  return (
    <div
      className={cn(biomarker.value.length > 0 ? '' : 'opacity-30', className)}
    >
      <SparklineChart biomarker={biomarker} maxValuesToShow={4} />
    </div>
  );
}
