import { BiomarkerResult, Range } from '@/types/api';

export function calculateYMin(
  results: BiomarkerResult[],
  range: Range[],
): number {
  const resultVals = results.map(
    (r: BiomarkerResult): number => r.quantity.value,
  );
  const rangeVals = range
    .map((r: Range) => r.low?.value)
    .filter((n: number | undefined): boolean => !!n) as number[];

  const min = Math.min(...resultVals, ...rangeVals);

  return Number((Math.round(min) * 0.8).toPrecision(3));
}
