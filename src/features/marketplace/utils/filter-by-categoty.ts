import type { MarketplaceFilter } from '@/features/marketplace/components/marketplace-filters';

export const filterByCategory = (
  classifications: Array<string | undefined> | undefined | null,
  filter: MarketplaceFilter,
) => {
  if (filter === 'all') {
    return true;
  }

  if (!classifications || classifications.length === 0) {
    return false;
  }

  const normalizedFilter = filter.toLowerCase();

  return classifications.some((classification) => {
    const normalized = classification?.trim().toLowerCase();
    return normalized === normalizedFilter;
  });
};
