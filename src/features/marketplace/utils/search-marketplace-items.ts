import uFuzzy from '@leeoniya/ufuzzy';

import { MarketplaceFilter } from '@/features/marketplace/const/categories';
import { filterByCategory } from '@/features/marketplace/utils/filter-by-category';

type MarketplaceEntity = {
  name: string;
  additionalClassification?: string[] | null;
  vendor?: string | null;
};

const uf = new uFuzzy({
  // SingleError typo tolerance (Damerau–Levenshtein distance = 1 per term).
  intraMode: 1,
});

const buildSearchText = (item: MarketplaceEntity) => {
  const parts = [
    item.name,
    item.vendor,
    ...(item.additionalClassification ?? []),
  ];
  return parts.filter(Boolean).join(' ');
};

export const searchMarketplaceItems = <T extends MarketplaceEntity>(
  items: T[] = [],
  filter: MarketplaceFilter,
  query: string,
) => {
  const filteredByCategory = items.filter((item) =>
    filterByCategory(item.additionalClassification, filter),
  );

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return filteredByCategory;
  }

  const haystack = filteredByCategory.map(buildSearchText);
  const [idxs, info, order] = uf.search(haystack, trimmedQuery);

  if (!idxs) {
    return [];
  }

  if (info && order) {
    return order.map((infoIdx) => filteredByCategory[info.idx[infoIdx]] as T);
  }

  return idxs.map((idx) => filteredByCategory[idx] as T);
};
