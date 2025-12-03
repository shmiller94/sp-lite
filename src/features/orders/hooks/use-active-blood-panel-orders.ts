import { useMemo } from 'react';

import { isBloodPanelService } from '@/const/services';
import { useOrders } from '@/features/orders/api';
import { OrderStatus } from '@/types/api';

/**
 * Hook to get the active (non-completed/cancelled/revoked) blood panel order
 * Returns the soonest upcoming blood panel order by start timestamp
 */
export const useActiveBloodPanelOrders = () => {
  const { data: ordersData, isLoading: isOrdersLoading } = useOrders();

  const activeBloodPanelOrder = useMemo(() => {
    const orders = ordersData?.orders ?? [];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Filter for blood panel orders that are not completed/cancelled/revoked
    const bloodPanelOrders = orders.filter((order) => {
      if (!isBloodPanelService(order.serviceName)) return false;
      if (order.status === OrderStatus.draft) return false;
      if (order.status === OrderStatus.completed) return false;
      if (order.status === OrderStatus.cancelled) return false;
      if (order.status === OrderStatus.revoked) return false;
      if (order.carePlan?.status === 'completed') return false;

      // Filter out legacy orders with completed diagnosticReport older than 30 days
      if (order.diagnosticReport?.status === 'final') {
        const orderDate = order.startTimestamp
          ? new Date(order.startTimestamp)
          : order.createdAt
            ? new Date(order.createdAt)
            : null;
        if (orderDate && orderDate < thirtyDaysAgo) {
          return false;
        }
      }

      return true;
    });

    // Sort by start timestamp (soonest first for upcoming appointments)
    bloodPanelOrders.sort((a, b) => {
      if (!a.startTimestamp) return 1;
      if (!b.startTimestamp) return -1;
      return (
        new Date(a.startTimestamp).getTime() -
        new Date(b.startTimestamp).getTime()
      );
    });

    return bloodPanelOrders[0] || null;
  }, [ordersData]);

  return {
    activeBloodPanelOrder,
    isLoading: isOrdersLoading,
  };
};
