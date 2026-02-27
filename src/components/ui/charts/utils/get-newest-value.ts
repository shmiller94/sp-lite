import { STATUS_TO_COLOR } from '@/const/status-to-color';
import type { BiomarkerResult } from '@/types/api';

// Extracts the newest value's numeric amount and mapped status color key.
// For range biomarkers, uses the midpoint of valueRange.low/high as the numeric value.
// Used by sparkline and time-series charts to determine the "current" status color.
export const getNewestValue = (
  values: BiomarkerResult[] | undefined,
):
  | {
      value: number;
      status: keyof typeof STATUS_TO_COLOR;
    }
  | undefined => {
  if (!values || values.length === 0) return undefined;

  const newestValue = values[0];
  if (!newestValue.status) return undefined;

  const statusMap: Record<string, keyof typeof STATUS_TO_COLOR> = {
    OPTIMAL: 'optimal',
    NORMAL: 'normal',
    HIGH: 'high',
    LOW: 'low',
    UNKNOWN: 'out of range',
    PENDING: 'out of range',
  };

  const value =
    newestValue.quantity?.value ??
    (newestValue.valueRange
      ? (newestValue.valueRange.low + newestValue.valueRange.high) / 2
      : 0);

  return {
    value,
    status: statusMap[newestValue.status] || 'out of range',
  };
};
