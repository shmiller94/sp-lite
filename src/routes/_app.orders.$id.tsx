import { createFileRoute, notFound } from '@tanstack/react-router';

import { Spinner } from '@/components/ui/spinner';
import { useOrders } from '@/features/orders/api';
import { RescheduleFlow } from '@/features/orders/components/reschedule';
import { useServices } from '@/features/services/api';

export const Route = createFileRoute('/_app/orders/$id')({
  component: OrderComponent,
});

function OrderComponent() {
  const { id } = Route.useParams();

  const getServicesQuery = useServices();
  const getOrdersQuery = useOrders();

  if (getOrdersQuery.isLoading || getServicesQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner variant="primary" size="lg" />
      </div>
    );
  }

  if (getOrdersQuery.isError || getServicesQuery.isError) {
    throw notFound();
  }

  let requestGroup:
    | NonNullable<typeof getOrdersQuery.data>['requestGroups'][number]
    | undefined = undefined;
  for (const rg of getOrdersQuery.data?.requestGroups ?? []) {
    if (rg.id === id) {
      requestGroup = rg;
      break;
    }
  }

  if (!requestGroup) {
    throw notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-9 md:px-16">
      <RescheduleFlow requestGroup={requestGroup} />
    </div>
  );
}
