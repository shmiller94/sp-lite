import { Spinner } from '@/components/ui/spinner';
import { Order } from '@/types/api';

import { useOrders } from '../api/get-orders';

import { OrderCard } from './order-card';

export const OrdersList = () => {
  const ordersQuery = useOrders();

  if (ordersQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!ordersQuery.data) return null;

  return (
    <>
      {ordersQuery.data.map((order: Order, i: number) => (
        <OrderCard key={i} orderId={order.id} />
      ))}
    </>
  );
};
