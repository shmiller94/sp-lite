import { NavLink, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Body1 } from '@/components/ui/typography/body1/body1';
import { useGroupedOrders } from '@/features/orders/hooks/use-grouped-orders';
import { cn } from '@/lib/utils';

export const MarketplaceOrdersButton = () => {
  const [searchParams] = useSearchParams();
  const isOrdersTab = searchParams.get('tab') === 'orders';
  const { buckets, groupedOrdersLoading } = useGroupedOrders();

  if (groupedOrdersLoading)
    return <Skeleton className="inline-flex h-8 w-32 rounded-full" />;

  const label =
    buckets.drafts.length > 0
      ? `View Orders (${buckets.drafts.length})`
      : 'View Orders';

  return (
    <Button asChild variant="ghost" className="gap-2 p-0">
      <NavLink to="?tab=orders" className="relative inline-flex items-center">
        <Body1
          as="span"
          className="text-primary transition-all duration-150 ease-in-out hover:text-secondary"
        >
          {label}
        </Body1>
        <div
          className={cn(
            'absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-vermillion-900 transition-all duration-150 ease-in-out',
            isOrdersTab ? 'opacity-100' : 'opacity-0',
          )}
        />
      </NavLink>
    </Button>
  );
};
