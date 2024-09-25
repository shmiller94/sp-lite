import { createStore } from 'zustand';

import { Product } from '@/types/api';

export interface CheckoutStore {
  selectedProducts: Product[];
  updateSelectedProducts: (product: Product) => void;
  reset: () => void;
}

export type CheckoutStoreApi = ReturnType<typeof checkoutStoreCreator>;

const initState = {
  selectedProducts: [],
};

export const checkoutStoreCreator = () => {
  return createStore<CheckoutStore>()((set) => ({
    ...initState,
    updateSelectedProducts: (product: Product) => {
      set((state) => {
        const existing = state.selectedProducts.find(
          (pr) => pr.id === product.id,
        );

        if (existing) {
          // Remove the product if it already exists
          return {
            ...state,
            selectedProducts: state.selectedProducts.filter(
              (pr) => pr.id !== product.id,
            ),
          };
        }

        // Add the new product if it doesn't exist
        return {
          ...state,
          selectedProducts: [...state.selectedProducts, product],
        };
      });
    },
    reset: () => set(initState),
  }));
};
