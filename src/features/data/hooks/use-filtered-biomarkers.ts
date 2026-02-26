import { useDeferredValue, useMemo } from 'react';

import { mostRecent } from '@/features/data/utils/most-recent-biomarker';
import { Biomarker, RequestGroup } from '@/types/api';

import { useDataFilterStore } from '../stores/data-filter-store';
import { StatusFilterOptionType } from '../types/filters';

interface FilterBiomarkersParams {
  biomarkers: Biomarker[];
  selectedCategories: string[];
  selectedOrder?: RequestGroup;
  selectedRange?: StatusFilterOptionType;
  searchQuery: string;
}

interface FilterConfig {
  categories?: boolean;
  date?: boolean;
  range?: boolean;
  search?: boolean;
}

export const filterBiomarkers = ({
  biomarkers,
  selectedCategories,
  selectedOrder,
  selectedRange,
  searchQuery,
}: FilterBiomarkersParams): Biomarker[] => {
  let filtered = biomarkers.filter((b) => b.value?.[0]?.quantity);

  if (selectedCategories.length > 0) {
    const selectedCategorySet = new Set(selectedCategories);
    const next: Biomarker[] = [];

    for (const biomarker of filtered) {
      if (!selectedCategorySet.has(biomarker.category)) continue;
      next.push(biomarker);
    }

    filtered = next;
  }

  const trimmedQuery = searchQuery.trim();
  if (trimmedQuery !== '') {
    const searchTerm = trimmedQuery.toLowerCase();
    const next: Biomarker[] = [];

    for (const biomarker of filtered) {
      const name = biomarker.name.toLowerCase();
      const category = biomarker.category.toLowerCase();
      if (name.includes(searchTerm) || category.includes(searchTerm)) {
        next.push(biomarker);
      }
    }

    filtered = next;
  }

  if (selectedRange != null && selectedRange !== 'all') {
    const next: Biomarker[] = [];

    for (const biomarker of filtered) {
      const mostRecentResult = mostRecent(biomarker.value);
      if (mostRecentResult == null) continue;

      const status = mostRecentResult.status ?? biomarker.status;

      switch (selectedRange) {
        case 'optimal':
          if (status === 'OPTIMAL') next.push(biomarker);
          break;
        case 'normal':
          if (status === 'NORMAL') next.push(biomarker);
          break;
        case 'out of range':
          if (status === 'HIGH' || status === 'LOW') next.push(biomarker);
          break;
        default:
          next.push(biomarker);
      }
    }

    filtered = next;
  }

  if (selectedOrder != null) {
    const selectedOrderIdSet = new Set<string>();
    for (const order of selectedOrder.orders) {
      selectedOrderIdSet.add(order.id);
    }

    // only filter which biomarkers are shown (those that have a value for this order/date),
    // but keep each biomarker's full value history intact for charts and dialogs.
    const next: Biomarker[] = [];

    for (const biomarker of filtered) {
      let hasSelectedOrder = false;

      for (const result of biomarker.value) {
        for (const orderId of result.orderIds) {
          if (!selectedOrderIdSet.has(orderId)) continue;
          hasSelectedOrder = true;
          break;
        }

        if (hasSelectedOrder) break;
      }

      if (!hasSelectedOrder) continue;
      next.push(biomarker);
    }

    filtered = next;
  }

  return filtered;
};

interface UseFilteredBiomarkersParams {
  biomarkers?: Biomarker[];
  enabledFilters?: FilterConfig;
}

export const useFilteredBiomarkers = ({
  biomarkers,
  enabledFilters,
}: UseFilteredBiomarkersParams): Biomarker[] => {
  const { selectedCategories, selectedOrder, selectedRange, searchQuery } =
    useDataFilterStore();
  const deferredQuery = useDeferredValue(searchQuery);

  const categoriesEnabled = enabledFilters?.categories ?? true;
  const dateEnabled = enabledFilters?.date ?? true;
  const rangeEnabled = enabledFilters?.range ?? true;
  const searchEnabled = enabledFilters?.search ?? true;

  return useMemo(() => {
    if (biomarkers == null) return [];

    return filterBiomarkers({
      biomarkers,
      selectedCategories: categoriesEnabled ? selectedCategories : [],
      selectedOrder: dateEnabled ? selectedOrder : undefined,
      selectedRange: rangeEnabled ? selectedRange : undefined,
      searchQuery: searchEnabled ? deferredQuery : '',
    });
  }, [
    biomarkers,
    selectedCategories,
    selectedOrder,
    selectedRange,
    deferredQuery,
    categoriesEnabled,
    dateEnabled,
    rangeEnabled,
    searchEnabled,
  ]);
};
