import { useEffect } from 'react';

import { SUPERPOWER_BLOOD_PANEL } from '@/const';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { useOrders } from '@/features/orders/api';
import { getDraftCollectionMethod } from '@/features/orders/utils/get-draft-collection-method';
import { OrderStatus } from '@/types/api';

export const useSyncOnboardingStorage = () => {
  const getOrdersQuery = useOrders();
  const updateCollectionMethod = useOnboarding((s) => s.updateCollectionMethod);
  const updateBloodOrderId = useOnboarding((s) => s.updateBloodOrderId);
  // TODO: we can potentially sync user address and other orders as well

  useEffect(() => {
    console.info('Syncing local storage...');
    if (!getOrdersQuery.data) {
      console.warn('Unable to sync local storage');
      return;
    }

    const orders = getOrdersQuery.data.orders;

    const draftOrders = orders
      .filter((o) => o.status === OrderStatus.draft)
      .filter((o) => o.name === SUPERPOWER_BLOOD_PANEL);

    if (!draftOrders.length) {
      console.warn('No draft orders found for user.');
      return;
    }

    // server sorts in descending order
    const mostRecentOrder = draftOrders[0];

    const collectionMethod = getDraftCollectionMethod(mostRecentOrder.method);

    if (collectionMethod) {
      updateCollectionMethod(collectionMethod);
    }
    updateBloodOrderId(mostRecentOrder.id);

    console.info('Finished syncing local storage...');
  }, [getOrdersQuery.data]);
};
