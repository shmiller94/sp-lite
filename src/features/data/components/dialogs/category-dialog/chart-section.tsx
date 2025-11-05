import { ScoreChart } from '@/components/ui/charts/score-chart/score-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { H4 } from '@/components/ui/typography';
import { Biomarker, CategoryValue } from '@/types/api';

export const ChartSection = ({
  isLoading,
  biomarkers,
  value,
  category,
}: {
  isLoading: boolean;
  biomarkers: Biomarker[];
  value?: CategoryValue;
  category: string;
}) => {
  return (
    <div className="flex h-56 w-full flex-col items-center justify-center py-2">
      {isLoading ? (
        <div className="flex size-full items-center justify-center gap-4">
          <Skeleton className="size-28 rounded-full" />
        </div>
      ) : (
        <ScoreChart biomarkers={biomarkers ?? []} value={value} size={160} />
      )}
      <H4>{category}</H4>
    </div>
  );
};
