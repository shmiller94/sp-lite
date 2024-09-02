import { BiomarkerResult, Range } from '@/types/api';

export function calculateYMax(
  results: BiomarkerResult[],
  range: Range[],
): number {
  const resultVals = results.map(
    (r: BiomarkerResult): number => r.quantity.value,
  );
  const rangeVals = range
    .map((r: Range) => r.high?.value)
    .filter((n: number | undefined): boolean => !!n) as number[];

  const max = Math.max(...resultVals, ...rangeVals);

  return Number((Math.round(max) * 1.2).toPrecision(3));
}
