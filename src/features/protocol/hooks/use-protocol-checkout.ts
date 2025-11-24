import { useCallback } from 'react';

import type { Activity } from '../api';
import { useCheckoutStore, type CheckoutItem } from '../stores/checkout-store';

const generateActivityId = (
  activity: Activity,
  goalId: string,
  index?: number,
): string => {
  const indexSuffix = index !== undefined ? `-${index}` : '';
  return `${goalId}-${activity.type || 'activity'}${indexSuffix}`;
};

export type UseProtocolCheckout = {
  items: CheckoutItem[];
  addItem: (activity: Activity, goalId: string, index?: number) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
  getItemsForGoal: (goalId: string) => CheckoutItem[];
  clearItems: () => void;
  itemCount: number;
  getActivityId: (activity: Activity, goalId: string, index?: number) => string;
};

export function useProtocolCheckout(): UseProtocolCheckout {
  const {
    items: itemsMap,
    addItem: addItemToStore,
    removeItem,
    hasItem,
    getItemsForGoal,
    clearItems,
    getItemCount,
  } = useCheckoutStore();

  const getActivityId = useCallback(
    (activity: Activity, goalId: string, index?: number) => {
      return generateActivityId(activity, goalId, index);
    },
    [],
  );

  const addItem = useCallback(
    (activity: Activity, goalId: string, index?: number) => {
      const itemId = generateActivityId(activity, goalId, index);
      const item: CheckoutItem = {
        id: itemId,
        type: 'activity',
        data: { ...activity },
        goalId,
      };
      addItemToStore(item);
    },
    [addItemToStore],
  );

  const items = Object.values(itemsMap);
  const itemCount = getItemCount();

  return {
    items,
    addItem,
    removeItem,
    hasItem,
    getItemsForGoal,
    clearItems,
    itemCount,
    getActivityId,
  };
}
