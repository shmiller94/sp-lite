import {
  Biomarker,
  BiomarkerResult,
  CodedRange,
  Lab,
  Range,
} from '@/types/api';

export interface BiomarkerRangeInfo {
  ranges: Range[];
  lastValue: Biomarker['value'][0] | null;
  lastValueSource: Lab;
  sortedValues: Biomarker['value'];
}

const PREFERENCE_ORDER = ['quest', 'labcorp', 'bioref', 'custom'] as Lab[];

/**
 * Returns the appropriate recent range for a biomarker based on last value.
 * Implements fallback to next best available range if lastValue source doesn't exist.
 */
export const getBiomarkerRanges = (
  biomarker: Biomarker,
): BiomarkerRangeInfo => {
  const sortedValues = [...biomarker.value].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const lastValue = sortedValues[0] || null;
  let lastValueSource = lastValue?.source || 'quest';

  // Read the last value source
  let ranges =
    biomarker.ranges?.[lastValueSource as keyof typeof biomarker.ranges] || [];

  // Fallback: If no ranges found for lastValue source, fallback to next best available range
  if (ranges.length === 0 && biomarker.ranges) {
    const availableSources = Object.keys(biomarker.ranges) as Array<
      keyof typeof biomarker.ranges
    >;

    for (const source of PREFERENCE_ORDER) {
      if (
        availableSources.includes(source) &&
        biomarker.ranges[source]?.length
      ) {
        ranges = biomarker.ranges[source] || [];
        lastValueSource = source;
        break;
      }
    }
  }

  return {
    ranges: ranges || [],
    lastValue,
    lastValueSource,
    sortedValues,
  };
};

/**
 * Returns ranges for a specific lab source if available, otherwise returns empty array.
 * Useful when mapping values that originate from mixed sources (Labcorp, Quest, etc.).
 */
export const getRangesBySource = (
  biomarker: Biomarker,
  source: Lab,
): Range[] => {
  const direct = biomarker.ranges?.[source as keyof typeof biomarker.ranges];
  if (direct && direct.length) return direct;

  // Fallback: try other available sources using the same preference order
  if (biomarker.ranges) {
    const availableSources = Object.keys(biomarker.ranges) as Array<
      keyof typeof biomarker.ranges
    >;

    // Build a prioritized list starting from the requested source, then PREFERENCE_ORDER
    const preference: Lab[] = [
      source,
      ...PREFERENCE_ORDER.filter((s) => s !== source),
    ];

    for (const s of preference) {
      if (
        availableSources.includes(s) &&
        biomarker.ranges[s] &&
        biomarker.ranges[s]!.length
      ) {
        return biomarker.ranges[s] as unknown as Range[];
      }
    }
  }

  return [];
};

export interface CodedBiomarkerRangeInfo {
  ranges: CodedRange[];
  lastValue: BiomarkerResult | null;
  lastValueSource: Lab;
  sortedValues: BiomarkerResult[];
}

// Same as getBiomarkerRanges but for codedValue biomarkers.
// Returns CodedRange[] (code + status pairs) from biomarker.codedRanges
// instead of numeric Range[] from biomarker.ranges.
export const getCodedBiomarkerRanges = (
  biomarker: Biomarker,
): CodedBiomarkerRangeInfo => {
  const sortedValues = [...biomarker.value].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const lastValue = sortedValues[0] || null;
  let lastValueSource: Lab = lastValue?.source || 'quest';

  let ranges = biomarker.codedRanges?.[lastValueSource] || [];

  if (ranges.length === 0 && biomarker.codedRanges) {
    for (const source of PREFERENCE_ORDER) {
      if (biomarker.codedRanges[source]?.length) {
        ranges = biomarker.codedRanges[source] || [];
        lastValueSource = source;
        break;
      }
    }
  }

  return {
    ranges: ranges || [],
    lastValue,
    lastValueSource,
    sortedValues,
  };
};
