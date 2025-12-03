import { useMemo } from 'react';

import { isBloodPanelService } from '@/const/services';
import { useOrders } from '@/features/orders/api';
import { OrderStatus } from '@/types/api';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Centralizes the logic for when to show/hide data based on orders and their care plans / diagnostic reports
export const useDataGating = () => {
  const { data: ordersData, isLoading } = useOrders();

  const orders = useMemo(() => {
    return ordersData?.orders?.filter(
      (o) =>
        isBloodPanelService(o.serviceName) &&
        o.status !== OrderStatus.cancelled &&
        o.status !== OrderStatus.revoked,
    );
  }, [ordersData?.orders]);

  const hasCompletedCarePlan = useMemo(() => {
    return orders?.some((o) => {
      if (o.carePlan?.status === 'completed') return true;

      // Legacy case: order has a completed diagnostic report and is older than 30 days (we did not have care plans at the time)
      const isLegacyCompleted =
        o.diagnosticReport?.status === 'final' &&
        o.createdAt &&
        new Date(o.createdAt).getTime() < Date.now() - THIRTY_DAYS_MS;

      return isLegacyCompleted;
    });
  }, [orders]);

  const hasPartialResults = useMemo(() => {
    const hasPartialDiagnosticReport = orders?.some(
      (o) => o.diagnosticReport?.status === 'partial',
    );

    return hasPartialDiagnosticReport && !hasCompletedCarePlan;
  }, [orders, hasCompletedCarePlan]);

  return {
    isLoading,
    hasCompletedCarePlan,
    hasPartialResults,
  };
};
