import { MarketplaceSkeleton } from '@/features/marketplace/components/marketplace-skeleton';
import { MarketplaceFilter } from '@/features/marketplace/const/categories';
import { getFilterDisplayLabel } from '@/features/marketplace/utils/category-utils';
import { getMarketplaceSearchMeta } from '@/features/marketplace/utils/get-marketplace-search-meta';
import { searchMarketplaceItems } from '@/features/marketplace/utils/search-marketplace-items';
import { useProgressiveReveal } from '@/hooks/use-progressive-reveal';
import { Product } from '@/types/api';
import { isMobile } from '@/utils/browser-detection';

import { getRecomendedSupplements } from '../utils/get-recommended-supplements';
import {
  SupplementsCategory,
  groupSupplementsByCategory,
} from '../utils/group-supplements-by-category';

import { SupplementCategory } from './supplement-category';

type SupplementsListProps = {
  products?: Product[];
  isLoading?: boolean;
  filter?: MarketplaceFilter;
  query?: string;
};

const INITIAL_SECTION_COUNT = isMobile() ? 1 : 3;

export const SupplementsList = ({
  products,
  isLoading,
  filter = 'all',
  query = '',
}: SupplementsListProps) => {
  const {
    trimmedQuery,
    isFiltered,
    isSearching,
    filterTitle,
    titleOverride,
    subtitleOverride,
  } = getMarketplaceSearchMeta(query, filter, 'supplements');

  const filteredSupplements = searchMarketplaceItems(
    products ?? [],
    filter,
    trimmedQuery,
  );

  const sections: SupplementsCategory = [];

  if (isFiltered || isSearching) {
    if (filteredSupplements.length) {
      sections.push({
        title: titleOverride ?? filterTitle,
        subtitle: subtitleOverride,
        products: filteredSupplements,
      });
    }
  } else {
    const categories = groupSupplementsByCategory(filteredSupplements);
    const recommended = getRecomendedSupplements(filteredSupplements);

    if (recommended.length) {
      sections.push({
        title: 'Top supplements for you',
        subtitle: 'Most recommended',
        products: recommended,
      });
    }

    sections.push(...categories);
  }

  const { visibleCount, hasMore, sentinelRef } = useProgressiveReveal({
    totalCount: sections.length,
    pageSize: INITIAL_SECTION_COUNT,
    resetDeps: [products, filter, query],
  });

  const renderedSections = sections.slice(0, visibleCount);

  if (isLoading) return <MarketplaceSkeleton />;

  if (!filteredSupplements.length) {
    return (
      <div className="flex flex-col items-center space-y-4 rounded-2xl border border-dashed border-zinc-200 px-6 py-10 text-center text-sm text-secondary">
        <p>
          {isSearching
            ? `No supplements found for “${trimmedQuery}”.`
            : filter === 'all'
              ? 'No supplements available right now.'
              : `No supplements available for “${getFilterDisplayLabel(filter, 'supplements')}” right now.`}
        </p>
      </div>
    );
  }

  if (!sections.length) return null;

  return (
    <div className="flex flex-col gap-14">
      {renderedSections.map(({ title, subtitle, products }) => (
        <SupplementCategory
          key={title}
          title={title}
          subtitle={subtitle}
          products={products}
        />
      ))}
      {/* Threshold for progressive scroll */}
      {hasMore && <div ref={sentinelRef} className="h-1" />}
    </div>
  );
};
