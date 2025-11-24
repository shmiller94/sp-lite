import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { Activity } from '../api/get-protocol';

export type CheckoutItem = {
  id: string;
  type: 'activity';
  data: Activity;
  goalId: string;
};

type CheckoutStore = {
  items: Record<string, CheckoutItem>;
  addItem: (item: CheckoutItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
  getItemsForGoal: (goalId: string) => CheckoutItem[];
  getAllItems: () => CheckoutItem[];
  clearItems: () => void;
  getItemCount: () => number;
};

export const useCheckoutStore = create<CheckoutStore>()(
  devtools(
    immer((set, get) => ({
      items: {},

      addItem: (item: CheckoutItem) => {
        set((state) => {
          state.items[item.id] = item;
        });
      },

      removeItem: (itemId: string) => {
        set((state) => {
          delete state.items[itemId];
        });
      },

      hasItem: (itemId: string) => {
        return itemId in get().items;
      },

      getItemsForGoal: (goalId: string) => {
        const items = get().items;
        return Object.values(items).filter((item) => item.goalId === goalId);
      },

      getAllItems: () => {
        return Object.values(get().items);
      },

      clearItems: () => {
        set((state) => {
          state.items = {};
        });
      },

      getItemCount: () => {
        return Object.keys(get().items).length;
      },
    })),
    { name: 'protocol-checkout-store' },
  ),
);
