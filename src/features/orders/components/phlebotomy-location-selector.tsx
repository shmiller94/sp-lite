import { useMemo } from 'react';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Body1, H3 } from '@/components/ui/typography';
import { isBloodPanel } from '@/const';
import { useOrders } from '@/features/orders/api';
import { useOrder } from '@/features/orders/stores/order-store';
import { getCollectionMethods } from '@/features/orders/utils/get-collection-methods';
import { useUser } from '@/lib/auth';
import { useAuthorization } from '@/lib/authorization';
import { cn } from '@/lib/utils';
import { CollectionMethodType, OrderStatus } from '@/types/api';
import { formatMoney } from '@/utils/format-money';

export const CreateOrderPhlebotomyLocationSelector = () => {
  const {
    collectionMethod,
    service,
    updateCollectionMethod,
    updateLocation,
    updateSlot,
  } = useOrder((s) => s);
  const { data: user } = useUser();
  const { checkAdminActorAccess } = useAuthorization();
  const isAdmin = checkAdminActorAccess();
  const { data: ordersData } = useOrders();

  const handleOptionClick = (optionValue: CollectionMethodType) => {
    updateCollectionMethod(
      collectionMethod === optionValue ? null : optionValue,
    );
    updateLocation(null);
    updateSlot(null);
  };

  // Check if user has an AT_HOME credit from a draft order
  const hasAtHomeCredit = useMemo(() => {
    if (!ordersData?.orders) return false;

    return ordersData.orders.some(
      (order) =>
        order.status === OrderStatus.draft &&
        order.method.includes('AT_HOME') &&
        isBloodPanel(order.name),
    );
  }, [ordersData?.orders]);

  const options = useMemo(
    () =>
      getCollectionMethods(
        service,
        user?.primaryAddress,
        isAdmin,
        hasAtHomeCredit,
      ),
    [service, user?.primaryAddress, isAdmin, hasAtHomeCredit],
  );

  return (
    <RadioGroup
      defaultValue={collectionMethod ?? 'AT_HOME'}
      className="flex flex-col sm:flex-row"
    >
      {options.map((option) => (
        <div
          key={option.value}
          className={cn(
            'flex space-x-4 border-2 rounded-3xl p-6 flex-1 bg-white',
            collectionMethod === option.value
              ? 'border-zinc-500 bg-zinc-50'
              : 'border-zinc-200 hover:bg-zinc-50',
            option.disabled ? 'opacity-50' : null,
          )}
          role="presentation"
          onClick={() =>
            option.disabled ? undefined : handleOptionClick(option.value)
          }
        >
          <RadioGroupItem
            value={option.value}
            checked={collectionMethod === option.value}
            className="mt-0.5 min-w-5"
            disabled={option.disabled}
          />
          <Label htmlFor={option.value} className="w-full">
            <div className="flex h-[140px] flex-col justify-between sm:h-[172px]">
              <div className="space-y-2 sm:space-y-3">
                <H3>{option.name}</H3>
                <Body1 className="text-sm text-zinc-500 sm:text-base">
                  {option.description}&nbsp;
                  {option.cancelationText}
                </Body1>
              </div>
              <Body1 className="text-sm text-zinc-500 sm:text-base">
                {option.pricingText ??
                  (option.price === 0
                    ? 'Included'
                    : `+${formatMoney(option.price)}`)}
              </Body1>
            </div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
