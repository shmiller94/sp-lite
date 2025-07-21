import { STATUS_TO_COLOR } from '@/const/status-to-color';
import type { BiomarkerResult } from '@/types/api';

// returns interpretation values based on newest value
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

  return {
    value: newestValue.quantity.value,
    status: statusMap[newestValue.status] || 'out of range',
  };
};
