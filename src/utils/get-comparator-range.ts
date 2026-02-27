import type { Comparator } from '@/types/api';

// Converts a comparator quantity into a low/high range for pill rendering.
// Returns undefined for EQUALS or missing comparator (caller falls through to dot).
export const getComparatorRange = (
  comparator: Comparator | undefined,
  value: number,
  chartMaxValue: number,
): { low: number; high: number } | undefined => {
  if (!comparator) return undefined;

  switch (comparator) {
    case 'LESS_THAN':
    case 'LESS_THAN_EQUALS':
      return { low: 0, high: value };
    case 'GREATER_THAN':
    case 'GREATER_THAN_EQUALS':
      return { low: value, high: chartMaxValue };
    case 'EQUALS':
    default:
      return undefined;
  }
};
