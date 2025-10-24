import { Product } from '@/types/api';

import { RECOMMENDED_SUPPLEMENTS } from '../const/recommended-supplements';

const normalize = (value: string) =>
  value.replace(/[^a-z0-9]/gi, '').toLowerCase();

export const getRecomendedSupplements = (products: Product[]): Product[] => {
  if (!products.length || !RECOMMENDED_SUPPLEMENTS.length) {
    return [];
  }

  return RECOMMENDED_SUPPLEMENTS.map((name) => {
    const target = normalize(name);

    return products.find((product) => {
      const productName = normalize(product.name);

      return (
        productName === target ||
        productName.includes(target) ||
        target.includes(productName)
      );
    });
  }).filter((product): product is Product => Boolean(product));
};
