import { useMemo, useState } from 'react';

import { getMarketplaceSearchMeta } from '@/features/marketplace/utils/get-marketplace-search-meta';

export const useMarketplaceSearch = () => {
  const [query, setQuery] = useState('');

  const { searchTitle, isSearching } = useMemo(() => {
    const meta = getMarketplaceSearchMeta(query, 'all');
    return {
      searchTitle: meta.searchTitle,
      isSearching: meta.isSearching,
    };
  }, [query]);

  return {
    query,
    setQuery,
    searchTitle,
    isSearching,
  };
};
