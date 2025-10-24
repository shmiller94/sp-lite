import { Product } from '@/types/api';

export const getPricingDetails = (product: Product) => {
  const hasDiscount = product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return { hasDiscount, discountedPrice };
};
