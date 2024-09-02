import { Biomarker } from '@/types/api';

export type NormalStatusType = 'NOT_FOUND' | 'LOW_NORMAL' | 'HIGH_NORMAL';

export const getNormalStatus = (biomarker: Biomarker): NormalStatusType => {
  const optimalRange = biomarker.range.find((rng) => rng.status === 'OPTIMAL');
  const lastValue = biomarker.value.length - 1;
  /*
   * If we don't find optimal range OR we don't have any values (just extra check)
   *
   * OR we don't have low range OR we don't have high range
   * */
  if (
    !optimalRange ||
    biomarker.value.length === 0 ||
    !optimalRange.low?.value ||
    !optimalRange.high?.value
  ) {
    return 'NOT_FOUND';
  }

  /*
   *  If less than low optimal => low normal
   *  If higher than high optimal => high normal
   * */
  if (biomarker.value[lastValue].quantity.value < optimalRange?.low?.value) {
    return 'LOW_NORMAL';
  } else if (
    biomarker.value[lastValue].quantity.value > optimalRange?.high?.value
  ) {
    return 'HIGH_NORMAL';
  }

  return 'NOT_FOUND';
};
