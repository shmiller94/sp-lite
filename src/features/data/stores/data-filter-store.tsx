import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { StatusFilterOptionType } from '@/features/data/types/filters';

interface DataFilterStore {
  selectedRange: StatusFilterOptionType;
  selectedCategories: string[];
  selectedOrderId?: string;
  searchQuery: string;
  updateRange: (selectedRange: StatusFilterOptionType) => void;
  updateCategories: (selectedCategories: string[]) => void;
  updateOrderId: (selectedOrderId: string) => void;
  updateSearchQuery: (searchQuery: string) => void;
  clearRange: () => void;
  clearCategories: () => void;
  clearOrderId: () => void;
  clearSearchQuery: () => void;
}

export const useDataFilterStore = create<DataFilterStore>()(
  devtools(
    (set) => ({
      selectedRange: 'all',
      selectedCategories: [],
      selectedOrderId: undefined,
      searchQuery: '',
      updateRange: (selectedRange) => set({ selectedRange }),
      updateCategories: (selectedCategories) => set({ selectedCategories }),
      updateOrderId: (selectedOrderId) => set({ selectedOrderId }),
      updateSearchQuery: (searchQuery) => set({ searchQuery }),
      clearRange: () => set({ selectedRange: 'all' }),
      clearCategories: () => set({ selectedCategories: [] }),
      clearOrderId: () => set({ selectedOrderId: undefined }),
      clearSearchQuery: () => set({ searchQuery: '' }),
    }),
    { name: 'DataFilterStore' },
  ),
);
