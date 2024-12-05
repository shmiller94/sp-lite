import * as Highcharts from 'highcharts';

import { Range } from '@/types/api';

import { ChartColor } from '../types';

type ZoneStatusType = 'OPTIMAL' | 'NORMAL' | 'OUT_OF_RANGE';

const statusColor: { [key in ZoneStatusType]: string } = {
  OPTIMAL: ChartColor.GREEN,
  NORMAL: ChartColor.YELLOW,
  OUT_OF_RANGE: ChartColor.RED,
};

const statusPriority: {
  [key in ZoneStatusType]: number;
} = {
  OPTIMAL: 1,
  NORMAL: 2,
  OUT_OF_RANGE: 3,
};

export const constructZones = (
  ranges: Range[],
): Highcharts.SeriesZonesOptionsObject[] => {
  const zones: Highcharts.SeriesZonesOptionsObject[] = [];

  /**
   * First step is to define set that will help us store only unique range values
   */
  const changePointsSet = new Set<number>();

  /**
   * Then we go through all range values one by one and add them to the set
   */
  ranges.forEach((range) => {
    if (range.low && range.low.value !== undefined) {
      changePointsSet.add(range.low.value);
    }
    if (range.high && range.high.value !== undefined) {
      changePointsSet.add(range.high.value);
    }
  });

  /**
   * Then we sort all values to get valid ranges
   */
  const changePoints = Array.from(changePointsSet).sort((a, b) => a - b);

  console.debug(`Got following changePoints, ${changePoints}`);

  for (let i = 0; i <= changePoints.length; i++) {
    const startValue = i === 0 ? -Infinity : changePoints[i - 1];
    const endValue = i < changePoints.length ? changePoints[i] : Infinity;

    console.debug(
      `We got following start ${startValue} and end value ${endValue}`,
    );

    /**
     * The idea here is to determine if end and start values fall into the specific range that we can find,
     * if it falls into two ranges we use priorities defined above
     */
    const coveringRanges = ranges.filter((range) => {
      const lowValue = range.low?.value ?? -Infinity;
      const highValue = range.high?.value ?? Infinity;
      return lowValue < endValue && highValue > startValue;
    });

    console.debug(`Got following covering ranges:`);
    console.debug(coveringRanges);

    if (coveringRanges.length > 1) {
      console.warn(
        `We got overlapping ranges, relying on priority map (OPTIMAL: 1, NORMAL: 2, OUT_OF_RANGE: 3) in this case`,
      );
    }

    let assignedStatus: ZoneStatusType | undefined;
    let highestPriority = Infinity;

    coveringRanges.forEach((range) => {
      const status = range.status as ZoneStatusType;
      const priority = statusPriority[status];
      /**
       * The priority works pretty easily, general structure should follow following style:
       *
       * <out_of_range>
       *   <normal>
       *     <optimal />
       *   <normal />
       * <out_of_range/>
       *
       * So therefore we assign priorities backwards:
       * Optimal - 1
       * Normal - 2
       * OOR - 3
       *
       * Then in the case value falls into both Normal and Optimal, Optimal would have higher priority and thus will get correct value assigned
       */
      if (priority < highestPriority) {
        assignedStatus = status;
        highestPriority = priority;
      }
    });

    // If no assigned status, it's out-of-range
    if (!assignedStatus) {
      /**
       * We assign out of range to mark zone in red color (typically from infinity to some low range limit
       * & high range limit to infinity
       */
      assignedStatus = 'OUT_OF_RANGE'; // or any default status
    }

    // Get the color
    const color = statusColor[assignedStatus];

    // TODO: add +1 or -1 to value if range comparator is LESS_THAN or GREATER_THAN

    // Create the zone
    const zone: Highcharts.SeriesZonesOptionsObject = {
      value: endValue !== Infinity ? endValue : undefined,
      color: color,
    };

    console.debug(`Pushing zone:`);
    console.debug(zone);

    zones.push(zone);
  }

  console.debug('Final zones:');
  console.debug(zones);

  return zones;
};
