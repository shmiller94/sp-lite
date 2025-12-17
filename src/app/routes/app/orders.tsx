import { H3 } from '@/components/ui/typography';
import { FinishScheduleList } from '@/features/orders/components/finish-schedule-list';
import { RequestGroupsList } from '@/features/orders/components/request-groups-list';

export const OrdersRoute = () => {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 py-9">
      <H3>Your orders</H3>
      <FinishScheduleList />

      <RequestGroupsList />
    </div>
  );
};
