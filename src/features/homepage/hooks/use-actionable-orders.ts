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
  date?: string;
};

/**
 * Hook to compute actionable orders:
 * - All draft orders (for booking)
 * - Active/completed orders that have a completed care plan (to view plan)
 * - Orders that have a completed diagnostic report and are older than 30 days (we did not have care plans at the time)
 * Results are annotated with lastViewed and sorted by date (most recent first)
 */
export const useActionableOrders = () => {
  const { data: ordersData, isLoading: isOrdersLoading } = useOrders();
  const { data: plansData, isLoading: isPlansLoading } = usePlans({});

  const actionableOrders = useMemo(() => {
    const orders = ordersData?.orders ?? [];
    const plans = plansData?.actionPlans ?? [];

    // Build a map of care plan ID to care plan data for quick lookup
    const carePlanMap = new Map(plans.map((plan) => [plan.id, plan]));

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
          if (order.carePlan?.status === 'completed') return true;

          // Legacy case: order has a completed diagnostic report and is older than 30 days
          const isLegacyCompleted =
            order.diagnosticReport?.status === 'final' &&
            order.createdAt &&
            new Date(order.createdAt).getTime() <
              Date.now() - 30 * 24 * 60 * 60 * 1000;

          return isLegacyCompleted;
        }
        return false;
      })
      .map((order) => {
        const carePlan = order.carePlan?.id
          ? carePlanMap.get(order.carePlan.id)
          : undefined;
        return {
          id: order.id,
          serviceName: order.serviceName,
          serviceId: order.serviceId,
          status: order.status,
          carePlanId: order.carePlan?.id,
          carePlanTitle: carePlan?.title,
          lastViewed: carePlan?.lastViewed,
          date: carePlan?.period?.start || order.createdAt,
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
