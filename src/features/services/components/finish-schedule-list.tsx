import { Skeleton } from '@/components/ui/skeleton';
import { Body1 } from '@/components/ui/typography';
import { useGroupedOrders } from '@/features/orders/hooks';

import { ServiceCard } from './service-card';

export const FinishScheduleList = () => {
  const { buckets, groupedOrdersLoading } = useGroupedOrders();

  if (groupedOrdersLoading) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:gap-x-8 sm:gap-y-6 lg:grid-cols-3">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              className="h-[100px] w-full rounded-[20px] md:h-[445px] md:rounded-3xl"
              key={i}
            />
          ))}
      </div>
    );
  }

  if (buckets.drafts.length === 0)
    return (
      <div className="flex shrink-0 items-center justify-center rounded-3xl border border-dashed border-zinc-300 py-12">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <Body1 className="text-zinc-500">Nothing here at this time.</Body1>
        </div>
      </div>
    );

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-x-8 sm:gap-y-6 lg:grid-cols-3">
      {buckets.drafts.map((draft) => {
        if (!draft.service) {
          return null;
        }

        return (
          <ServiceCard
            key={draft.order.id}
            service={draft.service}
            draftOrder={draft.order}
          />
        );
      })}
    </div>
  );
};
