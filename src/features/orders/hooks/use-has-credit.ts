import { useOrders } from '@/features/orders/api';
import { CollectionMethodType, OrderStatus } from '@/types/api';

interface UseHasCreditProps {
  serviceName: string;
  collectionMethod?: CollectionMethodType;
}

export const useHasCredit = ({
  serviceName,
  collectionMethod,
}: UseHasCreditProps) => {
  const ordersQuery = useOrders({});

  const existingDraftOrder = ordersQuery.data?.orders?.find((o) => {
    if (o.status !== OrderStatus.draft) return false;
    if (o.serviceName !== serviceName) return false;
    if (
      collectionMethod !== undefined &&
      o.collectionMethod !== collectionMethod
    )
      return false;
    return true;
  });

  return {
    isCreditLoading: ordersQuery.isLoading,
    credit: existingDraftOrder,
    hasCredit: !!existingDraftOrder,
  };
};
