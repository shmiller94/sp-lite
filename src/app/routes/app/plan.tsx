import { useParams } from 'react-router-dom';

import { Head } from '@/components/seo/head';
import { CarePlan } from '@/features/plans/components/care-plan';

export const PlanRoute = () => {
  const { id } = useParams();

  if (!id) {
    return null;
  }

  return (
    <>
      <Head title="Action Plan" />
      <CarePlan id={id} />
    </>
  );
};
