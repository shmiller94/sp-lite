import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Spinner } from '@/components/ui/spinner';
import { CompletedOrderCard } from '@/features/home/components/completed-order-card';
import { useOrders } from '@/features/orders/api/get-orders';
import { cn } from '@/lib/utils';
import { Order, OrderStatus } from '@/types/api';

export function CompletedOrdersList(): JSX.Element {
  const ordersQuery = useOrders();

  if (ordersQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner variant="primary" size="lg" />
      </div>
    );
  }

  if (!ordersQuery.data) return <></>;

  const { orders } = ordersQuery.data;

  const completedOrders = orders.filter(
    (order) =>
      order.status.toUpperCase() !== OrderStatus.cancelled &&
      order.status.toUpperCase() !== OrderStatus.draft &&
      order.status.toUpperCase() !== OrderStatus.revoked &&
      order.status.toUpperCase() !== OrderStatus.upcoming,
  );

  if (completedOrders.length === 0) return <CompletedOrdersListEmpty />;

  return (
    <Carousel className="w-full">
      <CarouselContent className={cn('h-[270px] md:h-auto', '-ml-1')}>
        {completedOrders.map((order: Order, index: number) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <CompletedOrderCard {...order} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden bg-white/90 sm:inline-flex" />
      <CarouselNext className="hidden bg-white/90 sm:inline-flex" />
    </Carousel>
  );
}

function CompletedOrdersListEmpty(): JSX.Element {
  return (
    <div className="flex shrink-0 items-center justify-center rounded-md py-10">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h3 className="mt-4 text-lg">No completed orders</h3>
        <p className="mb-4 mt-2 text-sm text-zinc-400">
          You have not completed any services.{' '}
        </p>
      </div>
    </div>
  );
}
