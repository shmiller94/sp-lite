import { Range } from '@/types/api';

import { ChartColor } from '../types';
import { constructZones } from '../utils';

test('Should handle 0-60 optimal, 60 - 74.9 normal range', () => {
  // Lipoprotein (a)
  const range: Range[] = [
    {
      status: 'OPTIMAL',
      low: {
        value: 0,
        comparator: 'EQUALS',
      },
      high: {
        value: 60,
        comparator: 'EQUALS',
      },
    },
    {
      status: 'NORMAL',
      low: {
        value: 60,
        comparator: 'EQUALS',
      },
      high: {
        value: 74.9,
        comparator: 'EQUALS',
      },
    },
  ];

  const zones = constructZones(range);

  const expectedZones = [
    { value: 0, color: ChartColor.RED },
    { value: 60, color: ChartColor.GREEN },
    { value: 74.9, color: ChartColor.YELLOW },
    { value: undefined, color: ChartColor.RED },
  ];

  expect(zones.length).toBe(expectedZones.length);

  for (let i = 0; i < zones.length; i++) {
    expect(zones[i].value).toBe(expectedZones[i].value);
    expect(zones[i].color).toBe(expectedZones[i].color);
  }
});

test('Should handle 0.5 - 1.5 optimal and 1.5 - 4.5 normal', () => {
  // Thyroid-Stimulating Hormone (TSH)
  const range: Range[] = [
    {
      status: 'NORMAL',
      low: {
        value: 1.5,
        comparator: 'EQUALS',
      },
      high: {
        value: 4.5,
        comparator: 'EQUALS',
      },
    },
    {
      status: 'OPTIMAL',
      low: {
        value: 0.5,
        comparator: 'EQUALS',
      },
      high: {
        value: 1.5,
        comparator: 'EQUALS',
      },
    },
  ];

  const zones = constructZones(range);

  const expectedZones = [
    { value: 0.5, color: ChartColor.RED },
    { value: 1.5, color: ChartColor.GREEN },
    { value: 4.5, color: ChartColor.YELLOW },
    { value: undefined, color: ChartColor.RED },
  ];

  expect(zones.length).toBe(expectedZones.length);

  for (let i = 0; i < zones.length; i++) {
    expect(zones[i].value).toBe(expectedZones[i].value);
    expect(zones[i].color).toBe(expectedZones[i].color);
  }
});

test('Should handle 264-700 normal and 700-1000 optimal', () => {
  // Testosterone, Total
  const range: Range[] = [
    {
      status: 'NORMAL',
      low: {
        value: 264,
        comparator: 'EQUALS',
      },
      high: {
        value: 700,
        comparator: 'EQUALS',
      },
    },
    {
      status: 'OPTIMAL',
      low: {
        value: 700,
        comparator: 'EQUALS',
      },
      high: {
        value: 1000,
        comparator: 'EQUALS',
      },
    },
  ];
  const zones = constructZones(range);

  const expectedZones = [
    { value: 264, color: ChartColor.RED },
    { value: 700, color: ChartColor.YELLOW },
    { value: 1000, color: ChartColor.GREEN },
    { value: undefined, color: ChartColor.RED },
  ];

  expect(zones.length).toBe(expectedZones.length);

  for (let i = 0; i < zones.length; i++) {
    expect(zones[i].value).toBe(expectedZones[i].value);
    expect(zones[i].color).toBe(expectedZones[i].color);
  }
});

test('Should handle only optimal range of 1.2-3.3', () => {
  // EPA
  const range: Range[] = [
    {
      status: 'OPTIMAL',
      low: {
        value: 1.2,
        comparator: 'EQUALS',
      },
      high: {
        value: 3.3,
        comparator: 'EQUALS',
      },
    },
  ];

  const zones = constructZones(range);

  const expectedZones = [
    { value: 1.2, color: ChartColor.RED },
    { value: 3.3, color: ChartColor.GREEN },
    { value: undefined, color: ChartColor.RED },
  ];

  expect(zones.length).toBe(expectedZones.length);

  for (let i = 0; i < zones.length; i++) {
    expect(zones[i].value).toBe(expectedZones[i].value);
    expect(zones[i].color).toBe(expectedZones[i].color);
  }
});

test('Should handle complex range with 0-90 normal, 60-80 optimal', () => {
  // EPA
  const range: Range[] = [
    {
      status: 'OPTIMAL',
      low: {
        value: 60,
        comparator: 'EQUALS',
      },
      high: {
        value: 80,
        comparator: 'EQUALS',
      },
    },
    {
      status: 'NORMAL',
      low: {
        value: 0,
        comparator: 'EQUALS',
      },
      high: {
        value: 90,
        comparator: 'EQUALS',
      },
    },
  ];

  const zones = constructZones(range);

  const expectedZones = [
    { value: 0, color: ChartColor.RED },
    { value: 60, color: ChartColor.YELLOW },
    { value: 80, color: ChartColor.GREEN },
    { value: 90, color: ChartColor.YELLOW },
    { value: undefined, color: ChartColor.RED },
  ];

  expect(zones.length).toBe(expectedZones.length);

  for (let i = 0; i < zones.length; i++) {
    expect(zones[i].value).toBe(expectedZones[i].value);
    expect(zones[i].color).toBe(expectedZones[i].color);
  }
});
