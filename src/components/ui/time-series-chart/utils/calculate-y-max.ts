import { BiomarkerResult, Range } from '@/types/api';

export function calculateYMax(
  results: BiomarkerResult[],
  range: Range[],
): number {
  const resultVals = results.map((r) => r.quantity.value);
  const rangeVals = range.map((r) => r.high?.value || -Infinity);
  const maxVal = Math.max(...resultVals, ...rangeVals);
  return Math.ceil(maxVal * 1.5); // Scale up by 20%
}
