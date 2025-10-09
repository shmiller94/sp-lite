import moment from 'moment';

import { useOrders } from '@/features/orders/api/get-orders';
import { HealthcareService, OrderStatus } from '@/types/api';

/**
 * Hook that checks if the user should see a notification about multiple blood test bookings
 * based on existing upcoming, scheduled, or recently completed blood tests.
 *
 * @param service - service currently being booked (required)
 * @returns boolean indicating whether to show the notification
 */
export const useScheduleGapWarning = (service: HealthcareService): boolean => {
  const { data: ordersData } = useOrders();
  const orders = ordersData?.orders || [];

  if (!service.supportsLabOrder) {
    return false;
  }

  // Filter for blood test orders that match the current service being booked
  const currentServiceOrders = orders.filter(
    (order) => order.serviceName === service.name,
  );

  // Check for upcoming/scheduled orders of the same service
  const upcomingOrScheduledOrders = currentServiceOrders.filter(
    (order) => order.status === OrderStatus.upcoming,
  );

  if (upcomingOrScheduledOrders.length > 0) {
    return true;
  }

  // Check for recently completed orders of the same service (within last 3 months)
  const threeMonthsAgo = moment().subtract(3, 'months');
  const recentCompletedOrders = currentServiceOrders.filter((order) => {
    if (order.status !== OrderStatus.completed) return false;

    // Use endTimestamp if available, otherwise fall back to startTimestamp
    const completionDate = moment(order.endTimestamp || order.startTimestamp);
    return completionDate.isAfter(threeMonthsAgo);
  });

  if (recentCompletedOrders.length > 0) {
    return true;
  }

  return false;
};
