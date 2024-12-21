import { Skeleton } from '@/components/ui/skeleton';
import { useBiomarkers } from '@/features/biomarkers/api/get-biomarkers';

import { columns } from './columns';
import { DataTable } from './data-table';

export const BiomarkerDataView = () => {
  const biomarkersQuery = useBiomarkers();

  if (biomarkersQuery.isLoading) {
    return <Skeleton className=" hidden h-[664px] rounded-3xl lg:block" />;
  }

  if (!biomarkersQuery.data) return <></>;

  return <DataTable data={biomarkersQuery.data.biomarkers} columns={columns} />;
};
