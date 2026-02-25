import { useCallback, useMemo } from 'react';

import { useMarketplace } from '@/features/marketplace/api/get-marketplace';
import type { Product } from '@/types/api';

/**
 * Shared hook that returns a lookup function for resolving a supplement
 * productId (from ProtocolAction.content) to its cheapest marketplace Product.
 *
 * Looks up by `Product.productId` first (cheapest variant), then falls back
 * to a direct `Product.id` match.
 */
export function useSupplementProductLookup() {
  const { data: marketplaceData } = useMarketplace();

  const supplementProducts = useMemo(
    () => marketplaceData?.supplements ?? [],
    [marketplaceData?.supplements],
  );

  const byProductId = useMemo(() => {
    const map = new Map<string, Product>();
    for (const product of supplementProducts) {
      if (!product.productId) continue;
      const existing = map.get(product.productId);
      if (!existing || product.price < existing.price) {
        map.set(product.productId, product);
      }
    }
    return map;
  }, [supplementProducts]);

  const byId = useMemo(() => {
    const map = new Map<string, Product>();
    for (const product of supplementProducts) {
      map.set(product.id, product);
    }
    return map;
  }, [supplementProducts]);

  return useCallback(
    (productId?: string): Product | null => {
      if (!productId) return null;
      return byProductId.get(productId) ?? byId.get(productId) ?? null;
    },
    [byProductId, byId],
  );
}
