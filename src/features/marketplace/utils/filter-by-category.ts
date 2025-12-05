import type { MarketplaceFilter } from '@/features/marketplace/const/categories';
import { matchesClassification } from '@/features/marketplace/utils/category-utils';

export const filterByCategory = (
  classifications: Array<string | undefined> | undefined | null,
  filter: MarketplaceFilter,
) => {
  return matchesClassification(classifications, filter);
};
