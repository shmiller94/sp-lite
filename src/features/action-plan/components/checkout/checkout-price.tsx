import { Body2, Body3 } from '@/components/ui/typography';
import { calculateDiscountedPrice } from '@/features/action-plan/utils/calculate-discount';
import { Product } from '@/types/api';

export const CheckoutPrice = ({ item }: { item: Product }) => {
  const discountedPrice = calculateDiscountedPrice(item.price, item.discount);

  return item.discount === 0 ? (
    <Body2>${item.price}</Body2>
  ) : (
    <div className="flex items-baseline gap-2">
      <Body2>${discountedPrice.toFixed(2)}</Body2>
      <Body2 className="text-vermillion-900">-{item.discount}%</Body2>
      <Body3 className="text-zinc-500 line-through">${item.price}</Body3>
    </div>
  );
};
