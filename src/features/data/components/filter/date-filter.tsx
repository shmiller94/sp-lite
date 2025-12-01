import { Calendar, ChevronDownIcon } from 'lucide-react';
import moment from 'moment';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { RadioButton } from '@/components/ui/radio-button';
import { Body1 } from '@/components/ui/typography';
import { isBloodPanelService } from '@/const/services';
import { useOrders } from '@/features/orders/api';

import { useDataFilterStore } from '../../stores/data-filter-store';

export const DateFilter = () => {
  const { selectedOrderId, updateOrderId, clearOrderId } = useDataFilterStore();
  const ordersQuery = useOrders();

  const orders =
    ordersQuery.data?.orders.filter(
      (o) => isBloodPanelService(o.serviceName) && o.status === 'COMPLETED',
    ) ?? [];

  if (orders.length <= 1) {
    return null;
  }

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 gap-2 px-4 text-zinc-500">
          <Calendar className="size-4 xs:hidden" />
          <Body1 className="hidden text-neutral-500 xs:block">
            {selectedOrder
              ? (() => {
                  try {
                    const m = moment(selectedOrder.endTimestamp);
                    return (
                      selectedOrder.timezone ? m.tz(selectedOrder.timezone) : m
                    ).format('MM/DD/YYYY');
                  } catch {
                    return moment(selectedOrder.endTimestamp).format(
                      'MM/DD/YYYY',
                    );
                  }
                })()
              : 'All dates'}
          </Body1>
          <ChevronDownIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            clearOrderId();
          }}
        >
          <RadioButton checked={!selectedOrderId} />
          <Body1>All dates</Body1>
        </DropdownMenuItem>
        {orders
          .sort((a, b) => moment(b.endTimestamp).diff(moment(a.endTimestamp)))
          .map((order) => (
            <DropdownMenuItem
              key={order.id}
              onClick={() => updateOrderId(order.id)}
            >
              <RadioButton checked={selectedOrderId === order.id} />
              <Body1>
                {(() => {
                  try {
                    const m = moment(order.endTimestamp);
                    return (order.timezone ? m.tz(order.timezone) : m).format(
                      'MM/DD/YYYY',
                    );
                  } catch {
                    return moment(order.endTimestamp).format('MM/DD/YYYY');
                  }
                })()}
              </Body1>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
