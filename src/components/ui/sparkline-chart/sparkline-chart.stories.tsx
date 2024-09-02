import { Meta } from '@storybook/react';
import React from 'react';

import { SparkLineChart } from './sparkline-chart';

export default {
  title: 'superpower/sparkline-chart',
  component: SparkLineChart,
} as Meta;

const optimalBoundedArgs = {
  data: [
    { x: 1, y: 10 },
    { x: 2, y: 20 },
    { x: 3, y: 30 },
    { x: 4, y: 40 },
    { x: 5, y: 50 },
    { x: 6, y: 100 },
    { x: 7, y: 0 },
    { x: 8, y: 50 },
  ],
  ranges: [
    {
      low: { value: 21 },
      high: { value: 100 },
      status: 'OPTIMAL',
    },
  ],
};

export const OptimalBounded = (): JSX.Element => {
  return (
    <>
      <SparkLineChart {...optimalBoundedArgs} />
    </>
  );
};

const SingleOptimalUnboundedUpperArgs = {
  ...optimalBoundedArgs,
  ranges: [
    {
      low: { value: 21 },
      status: 'OPTIMAL',
    },
  ],
  data: [{ x: 2, y: 20 }],
};

export const SingleOptimalUnboundedUpper = (): JSX.Element => {
  return (
    <>
      <SparkLineChart {...SingleOptimalUnboundedUpperArgs} />
    </>
  );
};

const DoubleOptimalUnboundedUpperArgs = {
  ...optimalBoundedArgs,
  ranges: [
    {
      low: { value: 21 },
      status: 'OPTIMAL',
    },
  ],
  data: [
    { x: 1, y: 10 },
    { x: 2, y: 20 },
    { x: 3, y: 30 },
  ],
};

export const DoubleOptimalUnboundedUpper = (): JSX.Element => {
  return (
    <>
      <SparkLineChart {...DoubleOptimalUnboundedUpperArgs} />
    </>
  );
};

const OptimalUnboundedUpperArgs = {
  ...optimalBoundedArgs,
  ranges: [
    {
      low: { value: 21 },
      status: 'OPTIMAL',
    },
  ],
  data: [
    { x: 1, y: 10 },
    { x: 2, y: 20 },
    { x: 3, y: 30 },
    { x: 4, y: 40 },
    { x: 5, y: 50 },
    { x: 6, y: 50 },
    { x: 7, y: 50 },
    { x: 8, y: 50 },
    { x: 9, y: 50 },
    { x: 10, y: 50 },
  ],
};

export const OptimalUnboundedUpper = (): JSX.Element => {
  return (
    <>
      <SparkLineChart {...OptimalUnboundedUpperArgs} />
    </>
  );
};

const OptimalUnboundedLowerArgs = {
  ...optimalBoundedArgs,
  ranges: [
    {
      high: { value: 100 },
      status: 'OPTIMAL',
    },
  ],
  data: [
    { x: 1, y: 10 },
    { x: 2, y: 20 },
    { x: 3, y: 30 },
    { x: 4, y: 40 },
    { x: 5, y: 50 },
    { x: 6, y: 100 },
    { x: 7, y: 50 },
    { x: 8, y: 50 },
    { x: 9, y: 50 },
    { x: 10, y: 40 },
  ],
};

export const OptimalUnboundedLower = (): JSX.Element => {
  return (
    <>
      <SparkLineChart {...OptimalUnboundedLowerArgs} />
    </>
  );
};

const OptimalAndNormalBoundedArgs = {
  ...optimalBoundedArgs,
  ranges: [
    {
      low: { value: 21 },
      high: { value: 100 },
      status: 'NORMAL',
    },
    {
      low: { value: 40 },
      high: { value: 80 },
      status: 'OPTIMAL',
    },
  ],
};

export const OptimalAndNormalBounded = (): JSX.Element => {
  return (
    <>
      <SparkLineChart {...OptimalAndNormalBoundedArgs} />
    </>
  );
};

const OptimalAndNormalUnboundedUpperArgs = {
  ...optimalBoundedArgs,
  ranges: [
    {
      low: { value: 21 },
      status: 'NORMAL',
    },
    {
      low: { value: 40 },
      status: 'OPTIMAL',
    },
  ],
};

export const OptimalAndNormalUnboundedUpper = (): JSX.Element => {
  return (
    <>
      <SparkLineChart {...OptimalAndNormalUnboundedUpperArgs} />
    </>
  );
};

const OptimalAndNormalUnboundedLowerArgs = {
  ...optimalBoundedArgs,
  ranges: [
    {
      high: { value: 100 },
      status: 'NORMAL',
    },
    {
      high: { value: 80 },
      status: 'OPTIMAL',
    },
  ],
};

export const OptimalAndNormalUnboundedLower = (): JSX.Element => {
  return (
    <div>
      <SparkLineChart {...OptimalAndNormalUnboundedLowerArgs} />
    </div>
  );
};
