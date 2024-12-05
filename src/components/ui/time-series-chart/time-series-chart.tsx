import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import React, { useRef } from 'react';

import { Body1 } from '@/components/ui/typography';
import { Biomarker, Range } from '@/types/api';

import { ChartColor, ChartPoint } from './types';
import {
  toChartPoint,
  calculateYMax,
  toChartPlotLines,
  toChartPlotBands,
  constructZones,
} from './utils';

export type TimeSeriesChartProps = {
  biomarker: Biomarker;
};

export function TimeSeriesChart({
  biomarker,
}: TimeSeriesChartProps): JSX.Element {
  const { range, value } = biomarker;
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const data = value.map(toChartPoint);

  const min = 0;
  const max = calculateYMax(value, range);

  const normalRange: Range | undefined = biomarker.range.find(
    (range: Range) => {
      return range.status.toUpperCase() === 'NORMAL';
    },
  );
  const optimalRange: Range | undefined = biomarker.range.find(
    (range: Range) => {
      return range.status.toUpperCase() === 'OPTIMAL';
    },
  );

  const zones = constructZones(biomarker.range);

  let softMin = -Infinity;
  let softMax = Infinity;

  softMin = Math.min(
    normalRange?.low?.value ?? Infinity,
    optimalRange?.low?.value ?? Infinity,
  );
  softMax = Math.max(
    normalRange?.high?.value ?? -Infinity,
    optimalRange?.low && !optimalRange?.high
      ? Infinity
      : optimalRange?.high?.value ?? -Infinity,
  );
  if (!isFinite(softMin)) softMin = -Infinity;
  if (!isFinite(softMax)) softMax = Infinity;

  const plotLines = toChartPlotLines(range);
  const plotBands = toChartPlotBands(range);

  data.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
  if (data.length === 1) {
    const laterDate = new Date(data[0].x);
    laterDate.setMonth(laterDate.getMonth() + 6);
    data.push({
      ...data[0],
      x: laterDate.getTime(),
      isPlaceholder: true,
    });
  }

  const showsFuturePoint = data.find((pt) => pt.isPlaceholder);

  const seriesData = data.map((pt: ChartPoint, i) => {
    return {
      x: i,
      y: pt.y,
      marker: pt.isPlaceholder ? { fillColor: '#c6c6c6' } : undefined,
      isPlaceholder: pt.isPlaceholder,
    };
  });

  const ColorStatus = {
    [ChartColor.GREEN]: 'Optimal',
    [ChartColor.RED]: 'Out of Range',
    [ChartColor.YELLOW]: 'Normal',
    [ChartColor.GREY]: 'Pending',
  };

  const options: Highcharts.Options = {
    chart: {
      backgroundColor: undefined,
      borderWidth: 0,
      type: 'line',
      height: 400,
      spacing: [0, 0, 0, 0],
      events: {
        render: () => {
          // this is an awful hack to create the y-axis
          // 1. we create horizontal bands (see plotBands.concat above)
          // 2. select the svg <path/> dom elements
          // 3. manually mutate the rectangles to be just lines
          // (if you comment out this useEffect you'll see what it's doing)
          const bands = document.getElementsByClassName(
            'y-axis-hack',
          ) as HTMLCollectionOf<SVGPathElement>;
          for (const band of bands) {
            // convert to vertical line
            const d = band.attributes.getNamedItem('d');
            const path = d?.value;
            if (path) {
              // svg path drawn values, example: M 35 81.5 L 534 81.5 L 534 0.5 L 35 0.5 Z
              const commands = path.split(' ');
              const left = commands[1];
              commands[4] = (Number(left) + 2).toString();
              commands[7] = (Number(left) + 2).toString();
              d.value = commands.join(' ');
              // band.attributes.setNamedItem(d)
            }
          }
        },
      },
    },
    title: {
      text: undefined,
    },
    credits: {
      enabled: false,
    },
    yAxis: {
      visible: true,
      min,
      max,
      endOnTick: false,
      startOnTick: false,
      labels: {
        enabled: false,
      },
      title: undefined,
      lineWidth: 0,
      lineColor: 'rgb(0,0,0,0.5)',
      gridLineWidth: 0,
      minorGridLineWidth: 0,
      // lines that go from data points on Y axes
      plotLines: plotLines.concat([
        {
          color: ChartColor.GREY,
          dashStyle: 'Dash', // Style of the plot line. Default to solid
          value: min,
          zIndex: 5,
        },
      ]),
      plotBands: plotBands.concat([
        {
          from: -Infinity,
          to: softMin,
          color: ChartColor.RED,
          className: 'y-axis-hack',
        },
        {
          from:
            optimalRange?.low?.value !== undefined
              ? optimalRange?.low?.value
              : -Infinity,
          to:
            optimalRange?.high?.value !== undefined
              ? optimalRange?.high?.value
              : Infinity,
          color: ChartColor.GREEN,
          className: 'y-axis-hack',
        },
        {
          from: softMin,
          to: optimalRange?.low?.value,
          color: ChartColor.YELLOW,
          className: 'y-axis-hack',
        },
        {
          from: optimalRange?.high?.value,
          to: softMax,
          color: ChartColor.YELLOW,
          className: 'y-axis-hack',
        },
        {
          from: softMax,
          to: Infinity,
          color: ChartColor.RED,
          className: 'y-axis-hack',
        },
      ]),
    },
    xAxis: {
      tickPixelInterval: 110,
      type: 'category',
      labels: {
        enabled: !!data.length,
        formatter: function (this) {
          const date = moment(data[Number(this.value)].x);
          const dm = date.format('MMM DD');
          const yr = date.format('YYYY');

          return `<div class="text-center">
              <h2 class="text-[18px] font-sans text-zinc-500">${dm}</h2>
              <p class="text-xs font-sans text-zinc-400">${yr}</p>
            </div>`;
        },
        useHTML: true,
      },
      ordinal: false,
      tickmarkPlacement: 'on',
      lineWidth: 0,
      lineColor: 'rgb(0,0,0,0.5)',
      gridZIndex: 0,
    },

    legend: {
      enabled: false,
    },
    plotOptions: {
      line: {
        states: {
          hover: {
            halo: {
              size: 16,
            },
          },
        },
      },
      series: {
        dashStyle: showsFuturePoint ? 'Dash' : undefined,
        shadow: false,
        marker: {
          radius: 7,
          lineWidth: 4,
          states: {
            hover: {
              radiusPlus: 1,
            },
          },
        },
        dataLabels: {
          enabled: true,
          padding: 14,
          style: {
            color: '#18181B',
            fontSize: '12px',
            fontWeight: '500',
          },
          formatter: function () {
            return this.y?.toFixed(1); // Format the value to 1 decimal place
          },
        },
      },
    },
    tooltip: {
      enabled: true,
      shape: 'rect',
      useHTML: true,
      backgroundColor: 'white',
      borderWidth: 0,
      borderRadius: 10,
      padding: 0,
      hideDelay: 0,
      shadow: false,
      style: {
        pointerEvents: 'auto',
      },
      formatter: function (this) {
        const isPlaceholder = (this.point as any).placeholder;
        const [integerPart, decimalPart = '0'] =
          this.y?.toString().split('.') || [];

        if (isPlaceholder) {
          return `
       <div class="shadow bg-white flex flex-col gap-2.5 items-center pb-4 pt-[18px] px-4 rounded-md font-sans">
        <p class="text-zinc-500">Schedule your<br /> annual re-test</p>
        <button class="bg-primary text-white px-4 py-2.5 rounded-lg"><a href="/services">Book now</a></button>
      </div>
    `;
        }
        return `
      <div class="shadow bg-white flex flex-row gap-x-2 py-2 px-4 rounded-md font-sans text-primary">
        <div class="rounded-full size-3" style="background: ${this.color};"></div>
        <p>${ColorStatus[this.color as ChartColor]}</p>
        <p>${integerPart}.${decimalPart}</p>
        <p class="text-zinc-500">${biomarker.unit}</p>
      </div>
    `;
      },
    },
    series: [
      {
        data: seriesData,
        zoneAxis: 'y',
        zones,
        lineWidth: 2,
        threshold: null,
        type: 'line',
      },
    ],
  };

  if (!biomarker.value.length) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center gap-2 bg-white">
        <Body1 className="text-zinc-500">No data yet</Body1>
      </div>
    );
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
    />
  );
}
