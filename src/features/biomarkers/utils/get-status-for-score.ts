import { BiomarkerStatus } from '@/types/api';

export const getStatusForScore = (score: number): BiomarkerStatus => {
  if (score < 60) {
    return 'LOW';
  } else if (score >= 60 && score < 80) {
    return 'NORMAL';
  } else if (score >= 80) {
    return 'OPTIMAL';
  }

  return 'UNKNOWN';
};
