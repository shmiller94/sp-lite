import Highcharts from 'highcharts';

import { Range } from '@/types/api';

export function toChartPlotLines(
  range: Range[],
): Highcharts.YAxisPlotLinesOptions[] {
  const plotLines: Highcharts.YAxisPlotLinesOptions[] = [];

  for (const r of range) {
    r.low && plotLines.push(plotLine(r.low.value, r.status));
    r.high && plotLines.push(plotLine(r.high.value, r.status));
  }

  return plotLines;
}

const plotLine = (
  value: number,
  status: string,
): Highcharts.YAxisPlotLinesOptions => {
  return {
    color: status === 'OPTIMAL' ? '#c5f3e2' : '#E4E4E7', // Color value
    dashStyle: 'Dash', // Style of the plot line. Default to solid
    value: value, // Value of where the line will appear
    width: 1, // Width of the line
    zIndex: 5,
    label: {
      text: `<span class="text-xs text-primary font-sans">${value.toString().split('.')[0]}</span><span class="text-zinc-400">.${
        value.toString().split('.')[1] || '0'
      }</span>`,
      useHTML: true,
    },
  };
};
