import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { StatusFilterOptionType } from '@/features/data/types/filters';
import { RequestGroup } from '@/types/api';

interface DataFilterStore {
  selectedRange: StatusFilterOptionType;
  selectedCategories: string[];
  selectedOrder?: RequestGroup;
  searchQuery: string;
  updateRange: (selectedRange: StatusFilterOptionType) => void;
  updateCategories: (selectedCategories: string[]) => void;
  updateSelectedOrder: (selectedOrder?: RequestGroup) => void;
  updateSearchQuery: (searchQuery: string) => void;
  clearRange: () => void;
  clearCategories: () => void;
  clearSelectedOrder: () => void;
  clearSearchQuery: () => void;
}

export const useDataFilterStore = create<DataFilterStore>()(
  devtools(
    (set) => ({
      selectedRange: 'all',
      selectedCategories: [],
      selectedOrder: undefined,
      searchQuery: '',
      updateRange: (selectedRange) => set({ selectedRange }),
      updateCategories: (selectedCategories) => set({ selectedCategories }),
      updateSelectedOrder: (selectedOrder) => set({ selectedOrder }),
      updateSearchQuery: (searchQuery) => set({ searchQuery }),
      clearRange: () => set({ selectedRange: 'all' }),
      clearCategories: () => set({ selectedCategories: [] }),
      clearSelectedOrder: () => set({ selectedOrder: undefined }),
      clearSearchQuery: () => set({ searchQuery: '' }),
    }),
    { name: 'DataFilterStore' },
  ),
);
