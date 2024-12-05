import { ColumnFiltersState, VisibilityState } from '@tanstack/react-table';
import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { useBiomarkers } from '@/features/biomarkers/api';
import { Biomarker } from '@/types/api';

import { getCols } from './columns';
import { DataTable } from './data-table';

interface BiomarkerDataTableProps {
  biomarkers?: Biomarker[];
  columnFilters?: ColumnFiltersState;
  columnVisibility?: VisibilityState;
  disableHeader?: boolean;
  disableToolbar?: boolean;
  cellClassName?: string;
}

export function BiomarkersDataTable(
  props: BiomarkerDataTableProps,
): React.ReactNode {
  const { data: biomarkersData, isLoading } = useBiomarkers();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[120px] w-full rounded-2xl" />
        <div className="space-y-3">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <Skeleton className="h-[104px] w-full rounded-2xl" key={i} />
            ))}
        </div>
      </div>
    );
  }

  if (!biomarkersData) return <></>;

  const columns = getCols();

  return (
    <DataTable
      columns={columns}
      data={props?.biomarkers ? props.biomarkers : biomarkersData.biomarkers}
      {...props}
    />
  );
}
