import { Body2, H4 } from '@/components/ui/typography';
import { STATUS_TO_COLOR } from '@/const/status-to-color';
import { useBiomarkers } from '@/features/biomarkers/api';
import { biomarkerStatusCount } from '@/features/biomarkers/utils/biomarkers-status-count';

export const BiomarkerDistributionBar = () => {
  const { data: biomarkersData } = useBiomarkers();

  const biomarkers = biomarkersData?.biomarkers ?? [];

  const numInRange = biomarkerStatusCount(biomarkers, ['OPTIMAL']);
  const numNormal = biomarkerStatusCount(biomarkers, ['NORMAL']);
  const numOutOfRange = biomarkerStatusCount(biomarkers, ['HIGH', 'LOW']);
  const numTotalBiomarkers = numInRange + numNormal + numOutOfRange;

  const optimalPercent =
    Math.round((numInRange / numTotalBiomarkers) * 100) || 0;
  const normalPercent = Math.round((numNormal / numTotalBiomarkers) * 100) || 0;
  const outOfRangePercent =
    Math.round((numOutOfRange / numTotalBiomarkers) * 100) || 0;

  return (
    <div className="mb-3 space-y-2">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-end md:gap-2">
          <H4 className="m-0 text-black transition-colors duration-300">
            {numInRange}
          </H4>
          <Body2 className="mb-1 text-secondary">Optimal markers</Body2>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:gap-2">
          <H4 className="text-black transition-colors duration-300">
            {numNormal}
          </H4>
          <Body2 className="mb-1 text-secondary">In range markers</Body2>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:gap-2">
          <H4 className="text-black transition-colors duration-300">
            {numOutOfRange}
          </H4>
          <Body2 className="mb-1 text-secondary">Out of range markers</Body2>
        </div>
      </div>
      <div className="flex h-1 w-full justify-end gap-1">
        {optimalPercent > 0 && (
          <div
            className="h-full rounded-full"
            style={{
              backgroundColor: STATUS_TO_COLOR.optimal,
              width: `${optimalPercent}%`,
            }}
          />
        )}
        {normalPercent > 0 && (
          <div
            className="h-full rounded-full"
            style={{
              backgroundColor: STATUS_TO_COLOR.normal,
              width: `${normalPercent}%`,
            }}
          />
        )}
        {outOfRangePercent > 0 && (
          <div
            className="h-full rounded-full"
            style={{
              backgroundColor: STATUS_TO_COLOR['out of range'],
              width: `${outOfRangePercent}%`,
            }}
          />
        )}
        <div
          className="h-full rounded-full bg-zinc-200"
          style={{
            width: `${100 - optimalPercent - normalPercent - outOfRangePercent}%`,
          }}
        />
      </div>
    </div>
  );
};
