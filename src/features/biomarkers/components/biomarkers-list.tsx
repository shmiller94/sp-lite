import { Spinner } from '@/components/ui/spinner';

import { useBiomarkers } from '../api/get-biomarkers';

import { BiomarkersTable, columns } from './biomarkers-table';

export const BiomarkersList = () => {
  const biomarkersQuery = useBiomarkers();

  if (biomarkersQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // if (!biomarkersQuery.data) return null;

  return <BiomarkersTable data={[]} columns={columns} />;
};
