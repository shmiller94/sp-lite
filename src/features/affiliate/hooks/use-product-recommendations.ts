import React from 'react';

import { useMarketplace } from '@/features/marketplace/api/get-marketplace';
import { useLatestProtocol, type Protocol } from '@/features/protocol/api';
import { Product } from '@/types/api';

/**
 * Extract product IDs from protocol actions (supplements)
 */
const extractProductIds = (protocol: Protocol): string[] => {
  const productIds: string[] = [];

  for (const goal of protocol.goals) {
    // Check primary action
    if (
      goal.primaryAction.content.type === 'supplement' &&
      goal.primaryAction.content.productId
    ) {
      productIds.push(goal.primaryAction.content.productId);
    }

    // Check additional actions
    for (const action of goal.additionalActions ?? []) {
      if (action.content.type === 'supplement' && action.content.productId) {
        productIds.push(action.content.productId);
      }
    }
  }

  return productIds;
};

/**
 * Decide on the products to recommend based on the products available and the protocol requests
 */
const getProducts = (
  /**
   * All products available in the shop (~500 items at the time of writing)
   */
  availableProducts: Product[],
  /**
   * Product ids requested by the protocol
   */
  protocolProductIds?: string[],
  /**
   * Number of products to return (default: 4)
   */
  n: number = 4,
) => {
  // compile maps for quick lookup
  const productIdMap = new Map<string, Product>();
  const productNameMap = new Map<string, Product>();

  for (const product of availableProducts) {
    productIdMap.set(product.id, product);
    productNameMap.set(product.name.toLowerCase(), product);
  }

  const fallbackProducts = [
    'Magnesium Glycinate',
    'O.N.E Omega-3',
    'MegaQuin K2 + D3',
    'NAC - N-Acetylcysteine',
    'Basic Nutrients 2/Day',
    // further fallbacks
    'Vitamin A',
    'Vitamin C',
    'Omega-3',
    'Ginger Extract',
  ];

  const products: Product[] = [];

  // prioritize protocol requests
  for (const productId of protocolProductIds ?? []) {
    const product = productIdMap.get(productId);
    if (product) {
      products.push(product);
    }
    if (products.length >= n) break;
  }

  // fill in with fallbacks if needed
  if (products.length < n) {
    for (const fallbackName of fallbackProducts) {
      const product = productNameMap.get(fallbackName.toLowerCase());
      if (product && !products.find((p) => p.id === product.id)) {
        products.push(product);
      }
      if (products.length >= n) break;
    }
  }

  // fill in with first available products if still needed
  if (products.length < n) {
    for (const product of availableProducts) {
      products.push(product);
      if (products.length >= n) break;
    }
  }

  return products;
};

export const useProductRecommendations = () => {
  const protocolQuery = useLatestProtocol();
  const protocol = protocolQuery.data?.protocol;

  const productIds = React.useMemo(() => {
    if (!protocol) return [];
    return extractProductIds(protocol);
  }, [protocol]);

  const { data: productsData, isLoading: isProductsLoading } = useMarketplace();

  const recommendedProducts = React.useMemo(() => {
    return getProducts(
      productsData?.supplements ?? [],
      productIds.length > 0 ? productIds : undefined,
    );
  }, [productIds, productsData?.supplements]);

  const isLoading = protocolQuery.isLoading || isProductsLoading;

  return {
    recommendedProducts,
    protocol,
    isLoading,
  };
};
