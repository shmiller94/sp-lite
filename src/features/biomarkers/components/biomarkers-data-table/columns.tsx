import 'moment-timezone';
import { ColumnDef } from '@tanstack/react-table';
import { Circle } from 'lucide-react';

import { BiomarkerSparklineChart } from '@/features/biomarkers/components/charts/biomarker-sparkline-chart';
import { StatusBadge } from '@/features/biomarkers/components/status-badge';
import { STATUS_TO_COLOR } from '@/features/biomarkers/const/status-to-color';
import { mostRecent } from '@/features/biomarkers/utils/most-recent-biomarker';
import { cn } from '@/lib/utils';
import { Biomarker, BiomarkerResult } from '@/types/api';

import { getOptimalRange } from '../../utils/get-optimal-range';

import { DataTableColumnHeader } from './data-table-column-header';

export const getCols = (): ColumnDef<Biomarker>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name: string = row.getValue('name');
      const category: string = row.original.category;
      const status: string = row.original.status;
      const result = mostRecent(row.original.value);

      return (
        <div className="flex flex-row gap-x-2.5 pl-4">
          <Circle
            className={`mt-1 block size-3 md:hidden`}
            style={{ fill: STATUS_TO_COLOR[status.toLowerCase()] }}
            strokeWidth={0}
          />
          <div className="flex w-full flex-col justify-between">
            <p className={cn('lg:text-base w-full light line-clamp-1')}>
              {name}
            </p>
            <p className="hidden w-full truncate text-gray-400 md:block lg:text-base">
              {category}
            </p>
            <p className="block w-full truncate text-gray-400 md:hidden lg:text-base">
              <ValueUnit result={result} baseUnit={row.original.unit} />
            </p>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value): boolean => {
      const rowValue = (row.getValue(id) as string).toLowerCase();

      if (Array.isArray(value)) {
        value = value.map((v: string) => v.toLowerCase());
        return value.includes(rowValue);
      }

      value = (value as string).toLowerCase();
      return rowValue.includes(value);
    },
  },
  {
    // Filter only
    accessorKey: 'category',
    filterFn: (row, id, value) => {
      return value.includes((row.getValue(id) as string).toLowerCase());
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="pl-4">
          <StatusBadge status={row.getValue('status')} />
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const filterVals = value[0]?.split(' ') || [];

      return filterVals.includes((row.getValue(id) as string).toLowerCase());
    },
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => {
      const result = mostRecent(row.original.value);

      return (
        <div className="pl-4">
          <div>
            <ValueUnit result={result} baseUnit={row.original.unit} />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'range',
    header: 'Optimal Range',
    cell: ({ row }) => {
      return (
        <div className="pl-4">
          <span
            className={`text-nowrap rounded-full px-5 py-3 text-center text-gray-500 ${
              row.getValue('status') === 'OPTIMAL'
                ? 'bg-green-50'
                : 'bg-slate-50'
            }`}
          >
            {getOptimalRange(row)}
          </span>
        </div>
      );
    },
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="History"
        className="xl:pl-[55px]"
      />
    ),
    id: 'sparkline',
    cell: ({ row }) => {
      return (
        <div>
          <BiomarkerSparklineChart biomarker={row.original} />
        </div>
      );
    },
  },
];

interface ValueUnitProps {
  result?: BiomarkerResult;
  baseUnit: string;
}

export function ValueUnit({ result, baseUnit }: ValueUnitProps): JSX.Element {
  const value =
    result?.quantity.value !== undefined ? result?.quantity.value : '-';
  const unit = result?.quantity.unit || baseUnit || '';
  let comparator = '';
  if (result?.quantity.comparator === 'LESS_THAN') {
    comparator = '<';
  } else if (result?.quantity.comparator === 'LESS_THAN_EQUALS') {
    comparator = '<=';
  } else if (result?.quantity.comparator === 'GREATER_THAN') {
    comparator = '>';
  } else if (result?.quantity.comparator === 'GREATER_THAN_EQUALS') {
    comparator = '>=';
  }

  return (
    <div className="space-x-1 truncate text-sm lg:text-base">
      <span className="text-black">
        {comparator}
        {value}
      </span>
      <span className="text-gray-400">{unit}</span>
    </div>
  );
}
