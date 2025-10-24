import { MarketplaceFilter } from '@/features/marketplace/components/marketplace-filters';

export const getMarketplaceSearchMeta = (
  query: string,
  filter: MarketplaceFilter,
) => {
  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();

  const isFiltered = filter !== 'all';
  const isSearching = trimmedQuery.length > 0;

  const filterTitle = `Filtered by “${filter}”`;
  const searchTitle = isSearching
    ? `Search results for “${trimmedQuery}”`
    : undefined;
  const titleOverride = searchTitle ?? (isFiltered ? filterTitle : undefined);
  const subtitleOverride = isSearching && isFiltered ? filterTitle : undefined;
  const resultsTitle = isSearching
    ? searchTitle ?? titleOverride ?? filterTitle
    : titleOverride ?? filterTitle;
  const resultsSubtitle = isSearching ? subtitleOverride : undefined;

  return {
    trimmedQuery,
    normalizedQuery,
    isFiltered,
    isSearching,
    filterTitle,
    searchTitle,
    titleOverride,
    subtitleOverride,
    resultsTitle,
    resultsSubtitle,
  };
};
