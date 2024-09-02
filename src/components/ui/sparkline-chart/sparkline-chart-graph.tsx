import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import React from 'react';

import { SparklineChartLegendBuilder } from './sparkline-chart-builder';

// NOTE
// This should probably be reworked using styled mode in HighCharts instead of setting everything in the options.
// We're not doing that now because time is limited.

/*
 * This component is real mess and needs to be reengineered from zero
 *
 * We are still using it because we don't have a lot of time for refactor
 * */

export function SparkLineChartGraph(props: any): JSX.Element {
  const builder = new SparklineChartLegendBuilder(
    props.ranges,
    props.data,
    props.unit,
    props.status,
  );

  const zones = builder.buildZones();
  const plotBands = builder.buildPlotBands();
  const min = builder.min();
  const max = builder.max();
  const data = builder.buildData();

  const options: Highcharts.Options = {
    chart: {
      backgroundColor: undefined,
      borderWidth: 0,
      borderColor: 'white',
      height: 80,
      width: null,
      margin: [0, 0, 0, 0],
      spacing: [0, 0, 0, 0],
      events: {
        load(): void {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const chart = this,
            series = chart.series[0];
          if (series.data.length > 0) {
            const point = series.data.slice(-4)[0];

            // Get the position of the point
            const x = chart.plotLeft + chart.xAxis[0].toPixels(point.x, true),
              y = chart.plotTop + chart.yAxis[0].toPixels(point.y ?? 0, true);

            // Draw a horizontal line from the y-axis to the single point
            chart.renderer
              .path(['M', chart.plotLeft, y, 'L', x, y] as any)
              .attr({
                stroke: point.color,
                'stroke-width': 2,
                'stroke-dasharray': '0 3 0',
                zIndex: 10,
              })
              .add();
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
    xAxis: {
      tickPixelInterval: 20,
      type: 'category',
      tickmarkPlacement: 'on',
      labels: {
        enabled: false,
      },
      title: {
        text: null,
      },
      tickPositions: [],
      ordinal: false,
    },
    yAxis: {
      min: min,
      max: max,
      labels: {
        enabled: false,
        format: '{value:.2f}',
      },
      gridLineWidth: 0,
      plotBands: plotBands,
      title: {
        text: null,
      },
      alignTicks: false,
      startOnTick: false,
      endOnTick: false,
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      hideDelay: 0,
      outside: true,
      shared: true,
      useHTML: true,
      borderRadius: 10,

      backgroundColor: 'transparent',
      borderColor: 'transparent',
      shadow: false,
      headerFormat: undefined,
      formatter: function () {
        return `<div class="shadow bg-white flex flex-row gap-x-2 items-center py-2 px-4 rounded-md"><span class="block" style="height: 10px; width: 10px; border-radius: 100%; background-color: ${
          this.point.color
        };"></span><div><b>${(this.point as any).value}</b><span style="color: gray;">${
          ' ' + (this.point as any).unit
        }<span class="ml-3">${(this.point as any).dateFormatted}</span></div></div>`;
      },
    },
    plotOptions: {
      series: {
        animation: false,
        lineWidth: 0,
        shadow: false,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        marker: {
          radius: 6,
          symbol: 'circle',
          lineColor: 'white',
          lineWidth: 2,
        },
      },
    },
    series: [
      // Split the data in to two series so we can draw a dotted line between the first two datapoints.
      {
        data: data.slice(Math.max(data.length - 4, 0), data.length),
        type: 'line',
        zones: zones,
        lineWidth: 2,
        states: {
          hover: {
            enabled: false,
          },
        },
        threshold: null,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
