import moment from 'moment';

import { BiomarkerResult } from '@/types/api';
import { ChartPoint } from '@/types/charts';

export function toChartPoint(result: BiomarkerResult): ChartPoint {
  return {
    x: new Date(result.timestamp).getTime(),
    y: result.quantity.value,
    dateFormatted: moment(result.timestamp)
      .tz(moment.tz.guess())
      .format('MMM D, YYYY'),
  };
}
