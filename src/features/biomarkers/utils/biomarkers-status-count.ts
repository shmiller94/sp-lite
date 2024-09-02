import { Biomarker, BiomarkerStatus } from '@/types/api';

export const biomarkerStatusCount = (
  biomarkers: Biomarker[],
  statuses: BiomarkerStatus[],
): number => {
  return biomarkers.filter((b: Biomarker) => statuses.includes(b.status))
    .length;
};
