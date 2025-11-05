import { useDeferredValue, useMemo } from 'react';

import { ADVANCED_BLOOD_PANEL, SUPERPOWER_BLOOD_PANEL } from '@/const/services';
import { mostRecent } from '@/features/data/utils/most-recent-biomarker';
import { Biomarker, Order, OrderStatus } from '@/types/api';

import { useDataFilterStore } from '../stores/data-filter-store';
import { StatusFilterOptionType } from '../types/filters';

interface FilterBiomarkersParams {
  biomarkers: Biomarker[];
  selectedCategories: string[];
  selectedOrderId?: string;
  selectedRange?: StatusFilterOptionType;
  orders: Order[];
  searchQuery: string;
}

interface FilterConfig {
  categories?: boolean;
  date?: boolean;
  range?: boolean;
}

export const filterBiomarkers = ({
  biomarkers,
  selectedCategories,
  selectedOrderId,
  selectedRange,
  orders,
  searchQuery,
}: FilterBiomarkersParams): Biomarker[] => {
  if (!biomarkers) return [];

  let filtered = biomarkers;

  if (selectedCategories.length > 0) {
    filtered = filtered.filter((b) => selectedCategories.includes(b.category));
  }

  if (searchQuery && searchQuery.trim() !== '') {
    const searchTerm = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((biomarker) => {
      const name = biomarker.name.toLowerCase();
      const category = biomarker.category.toLowerCase();
      return name.includes(searchTerm) || category.includes(searchTerm);
    });
  }

  if (selectedRange && selectedRange !== 'all') {
    filtered = filtered.filter((biomarker) => {
      const mostRecentResult = mostRecent(biomarker.value);
      if (!mostRecentResult) return false;

      const status = mostRecentResult.status || biomarker.status;

      switch (selectedRange) {
        case 'optimal':
          return status === 'OPTIMAL';
        case 'normal':
          return status === 'NORMAL';
        case 'out of range':
          return status === 'HIGH' || status === 'LOW';
        default:
          return true;
      }
    });
  }

  if (selectedOrderId) {
    const recentCompletedOrders = orders.filter(
      (o) =>
        o.status === OrderStatus.completed &&
        (o.serviceName === SUPERPOWER_BLOOD_PANEL ||
          o.serviceName === ADVANCED_BLOOD_PANEL),
    );
    const selectedOrder = recentCompletedOrders.find(
      (order) => order.id === selectedOrderId,
    );
    const orderDate = selectedOrder?.endTimestamp
      ? new Date(selectedOrder.endTimestamp)
      : null;

    // only filter which biomarkers are shown (those that have a value for this order/date),
    // but keep each biomarker's full value history intact for charts and dialogs.
    filtered = filtered.filter((biomarker) =>
      biomarker.value.some((result) => {
        if (result.orderId) return result.orderId === selectedOrderId;
        if (!orderDate) return false;
        const resultDate = new Date(result.timestamp);
        const timeDiff = Math.abs(resultDate.getTime() - orderDate.getTime());
        const oneDayInMs = 24 * 60 * 60 * 1000;
        return timeDiff <= oneDayInMs;
      }),
    );
  }

  return filtered;
};

interface UseFilteredBiomarkersParams {
  biomarkers?: Biomarker[];
  orders?: Order[];
  enabledFilters?: FilterConfig;
}

export const useFilteredBiomarkers = ({
  biomarkers,
  orders,
  enabledFilters = { categories: true, date: true, range: true },
}: UseFilteredBiomarkersParams): Biomarker[] => {
  const { selectedCategories, selectedOrderId, selectedRange, searchQuery } =
    useDataFilterStore();
  const deferredQuery = useDeferredValue(searchQuery);

  return useMemo(() => {
    if (!biomarkers || !orders) return [];

    return filterBiomarkers({
      biomarkers,
      selectedCategories: enabledFilters.categories ? selectedCategories : [],
      selectedOrderId: enabledFilters.date ? selectedOrderId : undefined,
      selectedRange: enabledFilters.range ? selectedRange : undefined,
      orders,
      searchQuery: deferredQuery,
    });
  }, [
    biomarkers,
    selectedCategories,
    selectedOrderId,
    selectedRange,
    orders,
    deferredQuery,
    enabledFilters.categories,
    enabledFilters.date,
    enabledFilters.range,
  ]);
};
