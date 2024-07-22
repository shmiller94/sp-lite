// import { Link } from '@/components/ui/link';
import { Spinner } from '@/components/ui/spinner';
import { Table } from '@/components/ui/table';
// import { formatDate } from '@/utils/format';

import { useBiomarkers } from '../api/get-biomarkers';

export const BiomarkersList = () => {
  const biomarkersQuery = useBiomarkers();

  if (biomarkersQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!biomarkersQuery.data) return null;

  return (
    <Table
      data={biomarkersQuery.data}
      columns={
        [
          // {
          //   title: 'Name',
          //   field: 'name',
          // },
          // {
          //   title: 'Status',
          //   field: 'status',
          // },
          // {
          //   title: 'Value',
          //   field: 'value',
          // },
          // {
          //   title: 'Optimal Range',
          //   field: 'range',
          // },
          // {
          //   title: 'History',
          //   field: 'history',
          // },
          // // {
          // //   title: '',
          // //   field: 'id',
          // //   Cell({ entry: { id } }) {
          // //     return <Link to={`./${id}`}>View</Link>;
          // //   },
          // // },
          // // {
          // //   title: '',
          // //   field: 'id',
          // //   Cell({ entry: { id } }) {
          // //     return <DeleteDiscussion id={id} />;
          // //   },
          // // },
          // // {
          // //   title: 'Created At',
          // //   field: 'createdAt',
          // //   Cell({ entry: { createdAt } }) {
          // //     return <span>{formatDate(createdAt)}</span>;
          // //   },
          // // },
        ]
      }
    />
  );
};
