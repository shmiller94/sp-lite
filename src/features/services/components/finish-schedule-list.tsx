import { Skeleton } from '@/components/ui/skeleton';
import { Body1 } from '@/components/ui/typography';
import { useOrders } from '@/features/orders/api';

import { useServices } from '../api/get-services';

import { ServiceCard } from './service-card';

export const FinishScheduleList = () => {
  const servicesQuery = useServices();
  const ordersQuery = useOrders();

  const isQueryLoading = servicesQuery.isLoading || ordersQuery.isLoading;

  if (isQueryLoading) {
    return (
      <div className="grid grid-cols-1 gap-1 sm:gap-x-3 sm:gap-y-9 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array(9)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              className="h-[76px] w-full rounded-[20px] md:h-[386px] md:rounded-3xl"
              key={i}
            />
          ))}
      </div>
    );
  }

  if (!servicesQuery.data || !ordersQuery.data) return null;

  const draftOrders = ordersQuery.data.orders.filter(
    (o) => o.status === 'DRAFT',
  );

  if (draftOrders.length === 0)
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Body1 className="text-zinc-500">Nothing here at this time.</Body1>
      </div>
    );

  // Step 3: Filter services where service.id is in serviceIdSet
  const filteredServices = servicesQuery.data.services.filter((service) =>
    draftOrders.map((o) => o.serviceId).includes(service.id),
  );

  return (
    <div className="grid grid-cols-1 gap-1 sm:gap-x-3 sm:gap-y-9 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredServices.map((service) => {
        const draftOrder = draftOrders.find((o) => o.serviceId === service.id);
        return (
          <ServiceCard
            key={service.id}
            service={service}
            draftOrderId={draftOrder?.id}
          />
        );
      })}
    </div>
  );
};
