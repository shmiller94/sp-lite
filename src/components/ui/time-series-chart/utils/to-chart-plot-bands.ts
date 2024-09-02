import Highcharts from 'highcharts';

import { Range } from '@/types/api';
import { capitalize } from '@/utils/format';

export function toChartPlotBands(
  range: Range[],
): Highcharts.YAxisPlotBandsOptions[] {
  const plotBand = (
    from: number,
    to: number,
    status: string,
  ): Highcharts.YAxisPlotBandsOptions => ({
    from,
    to,
    color:
      status.toUpperCase() === 'OPTIMAL'
        ? 'rgba(0, 252, 161, 0.05)'
        : 'transparent',
    borderWidth: 0,
    label:
      status.toUpperCase() === 'OPTIMAL'
        ? {
            text: capitalize(status.toLowerCase()),
            align: 'right',
            verticalAlign: 'top',
            y: 14,
            x: -20,
            // x: 20,
            style: {
              color: '#26936B',
            },
          }
        : undefined,
    zIndex: 1,
  });

  return range.map((range: Range) =>
    plotBand(
      range.low?.value !== undefined ? range.low?.value : -Infinity,
      range.high?.value !== undefined ? range.high?.value : Infinity,
      range.status,
    ),
  );
}
