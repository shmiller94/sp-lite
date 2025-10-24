import { Button } from '@/components/ui/button';
import { H2 } from '@/components/ui/typography';
import { MarketplaceFilter } from '@/features/marketplace/components/marketplace-filters';
import { MarketplaceSkeleton } from '@/features/marketplace/components/marketplace-skeleton';
import { getMarketplaceSearchMeta } from '@/features/marketplace/helper/get-marketplace-search-meta';
import { matchesMarketplaceQuery } from '@/features/marketplace/utils/matches-marketplace-query';
import { ServiceCard } from '@/features/services/components/service-card';
import { ServiceCategory } from '@/features/services/components/service-category';
import { getRecommendedServices } from '@/features/services/utils/get-recommended-services';
import { isAdvisoryCall } from '@/features/services/utils/is-advisory-call';
import { SupplementCard } from '@/features/supplements/components/supplement-card';
import { SupplementCategory } from '@/features/supplements/components/supplement-category';
import { getRecomendedSupplements } from '@/features/supplements/utils/get-recommended-supplements';
import { HealthcareService, Product } from '@/types/api';

type MarketplaceListProps = {
  services?: HealthcareService[];
  supplements?: Product[];
  isLoading?: boolean;
  filter: MarketplaceFilter;
  query?: string;
  onClearSearch?: () => void;
};

export const MarketplaceList = ({
  services,
  supplements,
  isLoading,
  filter,
  query = '',
  onClearSearch,
}: MarketplaceListProps) => {
  if (isLoading) return <MarketplaceSkeleton />;

  const {
    trimmedQuery,
    normalizedQuery,
    isFiltered,
    isSearching,
    resultsTitle,
    resultsSubtitle,
  } = getMarketplaceSearchMeta(query, filter);

  const filteredServices = (services ?? [])
    .filter((service) =>
      matchesMarketplaceQuery(service, filter, normalizedQuery),
    )
    .filter((service) => {
      if (!isSearching) return true;

      return !isAdvisoryCall(service);
    });

  const filteredSupplements = (supplements ?? []).filter((product) =>
    matchesMarketplaceQuery(product, filter, normalizedQuery),
  );

  const clearQueryButton = isSearching && !!onClearSearch;

  if (!filteredServices.length && !filteredSupplements.length) {
    return (
      <div className="flex flex-col items-center space-y-4 rounded-2xl border border-dashed border-zinc-200 px-6 py-10 text-center text-sm text-secondary">
        <p>
          {isSearching
            ? `No results found for “${trimmedQuery}”.`
            : filter === 'all'
              ? 'No products available right now.'
              : `No products available for “${filter}” right now.`}
        </p>
        {clearQueryButton ? (
          <Button variant="outline" size="medium" onClick={onClearSearch}>
            Clear search
          </Button>
        ) : null}
      </div>
    );
  }

  if (isFiltered || isSearching) {
    return (
      <MarketplaceFilteredCategory
        title={resultsTitle}
        subtitle={resultsSubtitle}
        products={filteredSupplements}
        services={filteredServices}
      />
    );
  }

  const recommendedServices = getRecommendedServices(filteredServices);
  const recommendedSupplements = getRecomendedSupplements(filteredSupplements);

  return (
    <div className="flex flex-col gap-14">
      {recommendedServices.length > 0 && (
        <ServiceCategory
          title="Top tests for you"
          subtitle="Most recommended"
          services={recommendedServices}
          path="?tab=tests"
        />
      )}
      {recommendedSupplements.length > 0 && (
        <SupplementCategory
          title="Top supplements for you"
          subtitle="According to your recent result"
          products={recommendedSupplements}
          path="?tab=supplements"
        />
      )}
    </div>
  );
};

type MarketplaceFilteredCategoryProps = {
  title: string;
  subtitle?: string;
  products: Product[];
  services: HealthcareService[];
};

const MarketplaceFilteredCategory = ({
  title,
  subtitle,
  products,
  services,
}: MarketplaceFilteredCategoryProps) => {
  const items = [
    ...services.map((service) => ({
      type: 'service' as const,
      id: service.id,
      node: <ServiceCard service={service} />,
    })),
    ...products.map((product) => ({
      type: 'product' as const,
      id: product.id,
      node: <SupplementCard product={product} />,
    })),
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col">
        <H2>{title}</H2>
        {subtitle && <H2 className="text-secondary">{subtitle}</H2>}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-x-8 sm:gap-y-6 lg:grid-cols-3">
        {items.map(({ id, node, type }) => (
          <div key={`${type}-${id}`} className="flex flex-col">
            {node}
          </div>
        ))}
      </div>
    </section>
  );
};
