import { getBiomarkerRanges } from '@/components/ui/charts/utils/get-biomarker-ranges';
import { Biomarker, BiomarkerStatus } from '@/types/api';

// Determines the display status (OPTIMAL, ABNORMAL, HIGH, LOW, etc.) for a biomarker.
// For codedValue biomarkers: looks up the newest value's coded text against codedRanges
// with source-preference fallback (quest > labcorp > bioref > custom).
// For quantity/range biomarkers: uses numeric ranges to find the matching status tier,
// falling back to HIGH/LOW based on whether the value exceeds range extremes.
export const calculateBiomarkerStatus = (
  biomarker: Biomarker,
): BiomarkerStatus => {
  if (!biomarker.value || biomarker.value.length === 0) return 'PENDING';

  if (biomarker.dataType === 'codedValue') {
    const lastValue = biomarker.value[0];
    if (!lastValue?.valueCoded) return 'PENDING';

    const source = lastValue.source || 'quest';
    const codedRanges = biomarker.codedRanges?.[source] || [];

    if (codedRanges.length === 0) {
      const prefOrder = ['quest', 'labcorp', 'bioref', 'custom'] as const;
      for (const s of prefOrder) {
        if (biomarker.codedRanges?.[s]?.length) {
          const match = biomarker.codedRanges[s].find(
            (r) => r.code === lastValue.valueCoded,
          );
          if (match)
            return match.status === 'optimal'
              ? 'OPTIMAL'
              : ('ABNORMAL' as BiomarkerStatus);
          break;
        }
      }
      return 'UNKNOWN';
    }

    const match = codedRanges.find((r) => r.code === lastValue.valueCoded);
    if (!match) return 'UNKNOWN';
    return match.status === 'optimal'
      ? 'OPTIMAL'
      : ('ABNORMAL' as BiomarkerStatus);
  }

  const { ranges, lastValue } = getBiomarkerRanges(biomarker);

  if (!lastValue) return 'PENDING';

  const latestValue =
    lastValue.quantity?.value ??
    (lastValue.valueRange
      ? (lastValue.valueRange.low + lastValue.valueRange.high) / 2
      : undefined);
  if (latestValue === undefined) return 'PENDING';

  if (!ranges || ranges.length === 0) return 'PENDING';

  for (const range of ranges) {
    const lowValue = range.low?.value ?? 0;
    const highValue = range.high?.value;

    if (highValue !== undefined) {
      if (latestValue >= lowValue && latestValue <= highValue) {
        return range.status as BiomarkerStatus;
      }
    } else {
      if (latestValue >= lowValue) {
        return range.status as BiomarkerStatus;
      }
    }
  }

  const highestRange = ranges.reduce((max, range) => {
    const rangeHigh = range.high?.value ?? 0;
    const maxHigh = max.high?.value ?? 0;
    return rangeHigh > maxHigh ? range : max;
  });

  const lowestRange = ranges.reduce((min, range) => {
    const rangeLow = range.low?.value ?? Infinity;
    const minLow = min.low?.value ?? Infinity;
    return rangeLow < minLow ? range : min;
  });

  if (highestRange.high && latestValue > highestRange.high.value) {
    return 'HIGH';
  }

  if (lowestRange.low && latestValue < lowestRange.low.value) {
    return 'LOW';
  }

  return 'PENDING';
};
