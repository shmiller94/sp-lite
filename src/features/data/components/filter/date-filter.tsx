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
import { useOrders } from '@/features/orders/api';

import { useDataFilterStore } from '../../stores/data-filter-store';

export const DateFilter = () => {
  const { selectedOrder, updateSelectedOrder, clearSelectedOrder } =
    useDataFilterStore();
  const ordersQuery = useOrders();

  const requestGroups =
    ordersQuery.data?.requestGroups.filter(
      (rg) => rg.appointmentType !== undefined && rg.status !== 'revoked',
    ) ?? [];

  if (requestGroups.length <= 1) {
    return null;
  }

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
            clearSelectedOrder();
          }}
        >
          <RadioButton checked={!selectedOrder} />
          <Body1>All dates</Body1>
        </DropdownMenuItem>
        {requestGroups.map((rg) => (
          <DropdownMenuItem key={rg.id} onClick={() => updateSelectedOrder(rg)}>
            <RadioButton checked={selectedOrder?.id === rg.id} />
            <Body1>
              {(() => {
                try {
                  const m = moment(rg.endTimestamp);
                  return (rg.timezone ? m.tz(rg.timezone) : m).format(
                    'MM/DD/YYYY',
                  );
                } catch {
                  return moment(rg.endTimestamp).format('MM/DD/YYYY');
                }
              })()}
            </Body1>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
