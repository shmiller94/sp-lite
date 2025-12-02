import { useMemo } from 'react';

import { ADVISORY_CALL } from '@/const';
import { useOrders } from '@/features/orders/api';
import { usePlans } from '@/features/protocol/api/get-plans';
import { OrderStatus } from '@/types/api';

type OrderWithCarePlan = {
  id: string;
  serviceName: string;
  serviceId: string;
  status: OrderStatus;
  carePlanId?: string;
  carePlanTitle?: string;
  lastViewed?: string;
  date?: string; // createdAt for draft orders, period.start for care plans
};

/**
 * Hook to compute actionable orders:
 * - All draft orders (for booking)
 * - Active/completed orders that have a completed care plan (to view plan)
 * Results are annotated with lastViewed and sorted by date (most recent first)
 */
export const useActionableOrders = () => {
  const { data: ordersData, isLoading: isOrdersLoading } = useOrders();
  const { data: plansData, isLoading: isPlansLoading } = usePlans({});

  const actionableOrders = useMemo(() => {
    const orders = ordersData?.orders ?? [];
    const plans = plansData?.actionPlans ?? [];

    const orderToCarePlanMap = new Map<
      string,
      { id: string; title?: string; lastViewed?: string; date?: string }
    >();

    plans
      .filter((plan) => plan.status === 'completed')
      .forEach((plan) => {
        const supportingInfo = plan.supportingInfo ?? [];
        supportingInfo.forEach((info) => {
          // Extract order ID from "ServiceRequest/{orderId}" format
          const reference = info.reference;
          if (reference?.startsWith('ServiceRequest/')) {
            const orderId = reference.replace('ServiceRequest/', '');
            orderToCarePlanMap.set(orderId, {
              id: plan.id!,
              title: plan.title,
              lastViewed: plan.lastViewed,
              date: plan.period?.start,
            });
          }
        });
      });

    // Filter for draft orders and active/completed orders with completed care plans
    // Exclude advisory calls from the list
    const result: OrderWithCarePlan[] = orders
      .filter((order) => {
        if (order.serviceName === ADVISORY_CALL) {
          return false;
        }
        if (order.status === OrderStatus.draft) {
          return true;
        }
        if (
          order.status === OrderStatus.active ||
          order.status === OrderStatus.completed
        ) {
          return orderToCarePlanMap.has(order.id);
        }
        return false;
      })
      .map((order) => {
        const carePlan = orderToCarePlanMap.get(order.id);
        return {
          id: order.id,
          serviceName: order.serviceName,
          serviceId: order.serviceId,
          status: order.status,
          carePlanId: carePlan?.id,
          carePlanTitle: carePlan?.title,
          lastViewed: carePlan?.lastViewed,
          date: carePlan?.date || order.createdAt,
        };
      })
      .sort((a, b) => {
        // Priority 1: Draft orders first
        const isDraftA = a.status === OrderStatus.draft;
        const isDraftB = b.status === OrderStatus.draft;
        if (isDraftA && !isDraftB) return -1;
        if (!isDraftA && isDraftB) return 1;

        // Priority 2: Unseen care plans
        const isUnseenA = !a.lastViewed;
        const isUnseenB = !b.lastViewed;
        if (isUnseenA && !isUnseenB) return -1;
        if (!isUnseenA && isUnseenB) return 1;

        // Priority 3: Sort by date (most recent first)
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });

    return result;
  }, [ordersData, plansData]);

  const unseenOrDrafts = useMemo(
    () =>
      actionableOrders.filter(
        (order) => order.status === OrderStatus.draft || !order.lastViewed,
      ),
    [actionableOrders],
  );

  const hasDrafts = actionableOrders.some(
    (order) => order.status === OrderStatus.draft,
  );

  return {
    actionableOrders,
    unseenOrDrafts,
    hasDrafts,
    isLoading: isOrdersLoading || isPlansLoading,
  };
};

export type { OrderWithCarePlan };
