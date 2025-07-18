import { STATUS_TO_COLOR } from '@/const/status-to-color';
import { BiomarkerStatus } from '@/types/api';

import { CategoryValue } from '../types/categories';

export const getBiomarkerColor = (
  value: CategoryValue | BiomarkerStatus,
): { default: string; light: string } => {
  switch (value) {
    case 'A':
    case 'OPTIMAL':
      return {
        default: STATUS_TO_COLOR.optimal,
        light: STATUS_TO_COLOR.optimal_light,
      };
    case 'B':
    case 'NORMAL':
      return {
        default: STATUS_TO_COLOR.normal,
        light: STATUS_TO_COLOR.normal_light,
      };
    case 'C':
    case 'HIGH':
      return {
        default: STATUS_TO_COLOR.high,
        light: STATUS_TO_COLOR.high_light,
      };
    case 'LOW':
      return {
        default: STATUS_TO_COLOR.low,
        light: STATUS_TO_COLOR.low_light,
      };
    case '-':
    case 'PENDING':
    default:
      return {
        default: STATUS_TO_COLOR.pending,
        light: STATUS_TO_COLOR.pending_light,
      };
  }
};
