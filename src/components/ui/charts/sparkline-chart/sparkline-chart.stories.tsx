import { Meta } from '@storybook/react';

import { SparklineChart } from './sparkline-chart';

export default {
  title: 'superpower/sparkline-chart',
  component: SparklineChart,
} as Meta;

const baseBiomarker = {
  id: 'test-biomarker-1',
  name: 'Test Biomarker',
  description: 'A test biomarker for sparkline chart',
  importance: 'high',
  status: 'NORMAL' as const,
  category: 'metabolism',
  unit: 'mg/dL',
  favorite: false,
  metadata: {
    source: [],
    content: [],
  },
};

const optimalBoundedBiomarker = {
  ...baseBiomarker,
  range: [
    {
      low: { value: 21 },
      high: { value: 100 },
      status: 'OPTIMAL' as const,
    },
  ],
  value: [
    {
      id: '1',
      quantity: { value: 10, comparator: 'EQUALS' as const },
      timestamp: '2024-01-01',
      component: [],
    },
    {
      id: '2',
      quantity: { value: 20, comparator: 'EQUALS' as const },
      timestamp: '2024-01-02',
      component: [],
    },
    {
      id: '3',
      quantity: { value: 30, comparator: 'EQUALS' as const },
      timestamp: '2024-01-03',
      component: [],
    },
    {
      id: '4',
      quantity: { value: 40, comparator: 'EQUALS' as const },
      timestamp: '2024-01-04',
      component: [],
    },
    {
      id: '5',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-05',
      component: [],
    },
    {
      id: '6',
      quantity: { value: 100, comparator: 'EQUALS' as const },
      timestamp: '2024-01-06',
      component: [],
    },
    {
      id: '7',
      quantity: { value: 0, comparator: 'EQUALS' as const },
      timestamp: '2024-01-07',
      component: [],
    },
    {
      id: '8',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-08',
      component: [],
    },
  ],
};

export const OptimalBounded = (): JSX.Element => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <SparklineChart biomarker={optimalBoundedBiomarker} />
    </div>
  );
};

const singleOptimalUnboundedUpperBiomarker = {
  ...baseBiomarker,
  range: [
    {
      low: { value: 21 },
      status: 'OPTIMAL' as const,
    },
  ],
  value: [
    {
      id: '1',
      quantity: { value: 20, comparator: 'EQUALS' as const },
      timestamp: '2024-01-02',
      component: [],
    },
  ],
};

export const SingleOptimalUnboundedUpper = (): JSX.Element => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <SparklineChart biomarker={singleOptimalUnboundedUpperBiomarker} />
    </div>
  );
};

const doubleOptimalUnboundedUpperBiomarker = {
  ...baseBiomarker,
  range: [
    {
      low: { value: 21 },
      status: 'OPTIMAL' as const,
    },
  ],
  value: [
    {
      id: '1',
      quantity: { value: 10, comparator: 'EQUALS' as const },
      timestamp: '2024-01-01',
      component: [],
    },
    {
      id: '2',
      quantity: { value: 20, comparator: 'EQUALS' as const },
      timestamp: '2024-01-02',
      component: [],
    },
    {
      id: '3',
      quantity: { value: 30, comparator: 'EQUALS' as const },
      timestamp: '2024-01-03',
      component: [],
    },
  ],
};

export const DoubleOptimalUnboundedUpper = (): JSX.Element => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <SparklineChart biomarker={doubleOptimalUnboundedUpperBiomarker} />
    </div>
  );
};

const optimalUnboundedUpperBiomarker = {
  ...baseBiomarker,
  range: [
    {
      low: { value: 21 },
      status: 'OPTIMAL' as const,
    },
  ],
  value: [
    {
      id: '1',
      quantity: { value: 10, comparator: 'EQUALS' as const },
      timestamp: '2024-01-01',
      component: [],
    },
    {
      id: '2',
      quantity: { value: 20, comparator: 'EQUALS' as const },
      timestamp: '2024-01-02',
      component: [],
    },
    {
      id: '3',
      quantity: { value: 30, comparator: 'EQUALS' as const },
      timestamp: '2024-01-03',
      component: [],
    },
    {
      id: '4',
      quantity: { value: 40, comparator: 'EQUALS' as const },
      timestamp: '2024-01-04',
      component: [],
    },
    {
      id: '5',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-05',
      component: [],
    },
    {
      id: '6',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-06',
      component: [],
    },
    {
      id: '7',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-07',
      component: [],
    },
    {
      id: '8',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-08',
      component: [],
    },
    {
      id: '9',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-09',
      component: [],
    },
    {
      id: '10',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-10',
      component: [],
    },
  ],
};

export const OptimalUnboundedUpper = (): JSX.Element => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <SparklineChart biomarker={optimalUnboundedUpperBiomarker} />
    </div>
  );
};

const optimalUnboundedLowerBiomarker = {
  ...baseBiomarker,
  range: [
    {
      high: { value: 100 },
      status: 'OPTIMAL' as const,
    },
  ],
  value: [
    {
      id: '1',
      quantity: { value: 10, comparator: 'EQUALS' as const },
      timestamp: '2024-01-01',
      component: [],
    },
    {
      id: '2',
      quantity: { value: 20, comparator: 'EQUALS' as const },
      timestamp: '2024-01-02',
      component: [],
    },
    {
      id: '3',
      quantity: { value: 30, comparator: 'EQUALS' as const },
      timestamp: '2024-01-03',
      component: [],
    },
    {
      id: '4',
      quantity: { value: 40, comparator: 'EQUALS' as const },
      timestamp: '2024-01-04',
      component: [],
    },
    {
      id: '5',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-05',
      component: [],
    },
    {
      id: '6',
      quantity: { value: 100, comparator: 'EQUALS' as const },
      timestamp: '2024-01-06',
      component: [],
    },
    {
      id: '7',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-07',
      component: [],
    },
    {
      id: '8',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-08',
      component: [],
    },
    {
      id: '9',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-09',
      component: [],
    },
    {
      id: '10',
      quantity: { value: 40, comparator: 'EQUALS' as const },
      timestamp: '2024-01-10',
      component: [],
    },
  ],
};

export const OptimalUnboundedLower = (): JSX.Element => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <SparklineChart biomarker={optimalUnboundedLowerBiomarker} />
    </div>
  );
};

const optimalAndNormalBoundedBiomarker = {
  ...baseBiomarker,
  range: [
    {
      low: { value: 21 },
      high: { value: 100 },
      status: 'NORMAL' as const,
    },
    {
      low: { value: 40 },
      high: { value: 80 },
      status: 'OPTIMAL' as const,
    },
  ],
  value: [
    {
      id: '1',
      quantity: { value: 10, comparator: 'EQUALS' as const },
      timestamp: '2024-01-01',
      component: [],
    },
    {
      id: '2',
      quantity: { value: 20, comparator: 'EQUALS' as const },
      timestamp: '2024-01-02',
      component: [],
    },
    {
      id: '3',
      quantity: { value: 30, comparator: 'EQUALS' as const },
      timestamp: '2024-01-03',
      component: [],
    },
    {
      id: '4',
      quantity: { value: 40, comparator: 'EQUALS' as const },
      timestamp: '2024-01-04',
      component: [],
    },
    {
      id: '5',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-05',
      component: [],
    },
    {
      id: '6',
      quantity: { value: 100, comparator: 'EQUALS' as const },
      timestamp: '2024-01-06',
      component: [],
    },
    {
      id: '7',
      quantity: { value: 0, comparator: 'EQUALS' as const },
      timestamp: '2024-01-07',
      component: [],
    },
    {
      id: '8',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-08',
      component: [],
    },
  ],
};

export const OptimalAndNormalBounded = (): JSX.Element => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <SparklineChart biomarker={optimalAndNormalBoundedBiomarker} />
    </div>
  );
};

const optimalAndNormalUnboundedUpperBiomarker = {
  ...baseBiomarker,
  range: [
    {
      low: { value: 21 },
      status: 'NORMAL' as const,
    },
    {
      low: { value: 40 },
      status: 'OPTIMAL' as const,
    },
  ],
  value: [
    {
      id: '1',
      quantity: { value: 10, comparator: 'EQUALS' as const },
      timestamp: '2024-01-01',
      component: [],
    },
    {
      id: '2',
      quantity: { value: 20, comparator: 'EQUALS' as const },
      timestamp: '2024-01-02',
      component: [],
    },
    {
      id: '3',
      quantity: { value: 30, comparator: 'EQUALS' as const },
      timestamp: '2024-01-03',
      component: [],
    },
    {
      id: '4',
      quantity: { value: 40, comparator: 'EQUALS' as const },
      timestamp: '2024-01-04',
      component: [],
    },
    {
      id: '5',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-05',
      component: [],
    },
    {
      id: '6',
      quantity: { value: 100, comparator: 'EQUALS' as const },
      timestamp: '2024-01-06',
      component: [],
    },
    {
      id: '7',
      quantity: { value: 0, comparator: 'EQUALS' as const },
      timestamp: '2024-01-07',
      component: [],
    },
    {
      id: '8',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-08',
      component: [],
    },
  ],
};

export const OptimalAndNormalUnboundedUpper = (): JSX.Element => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <SparklineChart biomarker={optimalAndNormalUnboundedUpperBiomarker} />
    </div>
  );
};

const optimalAndNormalUnboundedLowerBiomarker = {
  ...baseBiomarker,
  range: [
    {
      high: { value: 100 },
      status: 'NORMAL' as const,
    },
    {
      high: { value: 80 },
      status: 'OPTIMAL' as const,
    },
  ],
  value: [
    {
      id: '1',
      quantity: { value: 10, comparator: 'EQUALS' as const },
      timestamp: '2024-01-01',
      component: [],
    },
    {
      id: '2',
      quantity: { value: 20, comparator: 'EQUALS' as const },
      timestamp: '2024-01-02',
      component: [],
    },
    {
      id: '3',
      quantity: { value: 30, comparator: 'EQUALS' as const },
      timestamp: '2024-01-03',
      component: [],
    },
    {
      id: '4',
      quantity: { value: 40, comparator: 'EQUALS' as const },
      timestamp: '2024-01-04',
      component: [],
    },
    {
      id: '5',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-05',
      component: [],
    },
    {
      id: '6',
      quantity: { value: 100, comparator: 'EQUALS' as const },
      timestamp: '2024-01-06',
      component: [],
    },
    {
      id: '7',
      quantity: { value: 0, comparator: 'EQUALS' as const },
      timestamp: '2024-01-07',
      component: [],
    },
    {
      id: '8',
      quantity: { value: 50, comparator: 'EQUALS' as const },
      timestamp: '2024-01-08',
      component: [],
    },
  ],
};

export const OptimalAndNormalUnboundedLower = (): JSX.Element => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <SparklineChart biomarker={optimalAndNormalUnboundedLowerBiomarker} />
    </div>
  );
};
