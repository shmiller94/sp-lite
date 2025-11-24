import { getPricingDetails } from '@/features/supplements/utils/get-pricing-details';
import type { Product } from '@/types/api';

import type { Activity } from '../api';

import { getItemDetails } from './get-item-details';

export type ActivityPricing = {
  originalCents: number;
  finalCents: number;
  hasDiscount: boolean;
};

export const getActivityPricing = (
  activity: Activity,
  products?: Product[] | null,
): ActivityPricing => {
  const details = getItemDetails(activity);

  if (activity.type === 'product' && activity.product) {
    const product = products?.find((p) => p.id === activity.product!.id);
    const priceDollars = product?.price ?? activity.product.price ?? 0;
    const discountPct = product?.discount ?? activity.product.discount ?? 0;

    const { hasDiscount, discountedPrice } = getPricingDetails({
      id: activity.product.id,
      name: activity.product.name,
      image: activity.product.image,
      price: priceDollars,
      url: activity.product.url,
      discount: discountPct,
    });

    const originalCents = Math.round(priceDollars * 100);
    const finalCents = Math.round(discountedPrice * 100);
    return { originalCents, finalCents, hasDiscount };
  }

  const priceCents = Number(details.price) || 0;
  return {
    originalCents: priceCents,
    finalCents: priceCents,
    hasDiscount: false,
  };
};
