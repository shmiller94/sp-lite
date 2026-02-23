import { createFileRoute, notFound } from '@tanstack/react-router';

import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import { useMarketplace } from '@/features/marketplace/api/get-marketplace';
import { PrescriptionDetails } from '@/features/prescriptions/pdp/prescription-details';
import { getRecommendedPrescriptions } from '@/features/prescriptions/utils/get-recommended-prescriptions';

export const Route = createFileRoute('/_app/prescriptions/$id')({
  component: PrescriptionComponent,
});

function PrescriptionComponent() {
  const { id } = Route.useParams();

  const { data, isError, isLoading } = useMarketplace();

  let prescription:
    | NonNullable<typeof data>['prescriptions'][number]
    | undefined = undefined;
  for (const item of data?.prescriptions ?? []) {
    if (item.id === id) {
      prescription = item;
      break;
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner variant="primary" size="lg" />
      </div>
    );
  }

  if (isError || !prescription) {
    throw notFound();
  }

  const recommended = getRecommendedPrescriptions(data?.prescriptions ?? []);
  const otherPopularPrescriptions: typeof recommended = [];
  for (const item of recommended) {
    if (item.id !== prescription.id) {
      otherPopularPrescriptions.push(item);
    }
  }

  return (
    <ContentLayout className="max-w-[1453px]">
      <PrescriptionDetails
        prescription={prescription}
        otherPopularPrescriptions={otherPopularPrescriptions}
      />
    </ContentLayout>
  );
}
