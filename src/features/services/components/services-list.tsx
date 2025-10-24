import { MarketplaceFilter } from '@/features/marketplace/components/marketplace-filters';
import { MarketplaceSkeleton } from '@/features/marketplace/components/marketplace-skeleton';
import { getMarketplaceSearchMeta } from '@/features/marketplace/helper/get-marketplace-search-meta';
import { matchesMarketplaceQuery } from '@/features/marketplace/utils/matches-marketplace-query';
import { getRecommendedServices } from '@/features/services/utils/get-recommended-services';
import { isAdvisoryCall } from '@/features/services/utils/is-advisory-call';
import { HealthcareService } from '@/types/api';

import { ServiceCategory } from './service-category';

type ServicesListProps = {
  services?: HealthcareService[];
  isLoading?: boolean;
  filter?: MarketplaceFilter;
  query?: string;
};

export const ServicesList = ({
  services,
  isLoading,
  filter = 'all',
  query = '',
}: ServicesListProps) => {
  if (isLoading) return <MarketplaceSkeleton />;
  if (!services) return null;

  const {
    normalizedQuery,
    isFiltered,
    isSearching,
    filterTitle,
    titleOverride,
    subtitleOverride,
  } = getMarketplaceSearchMeta(query, filter);

  const filteredServices = services
    .filter((service) =>
      matchesMarketplaceQuery(service, filter, normalizedQuery),
    )
    .filter((service) => {
      if (!isSearching) return true;

      return !isAdvisoryCall(service);
    });

  let sections: {
    title: string;
    subtitle?: string;
    services: HealthcareService[];
  }[] = [];

  if (isFiltered || isSearching) {
    if (filteredServices.length) {
      sections = [
        {
          title: titleOverride ?? filterTitle,
          subtitle: subtitleOverride,
          services: filteredServices,
        },
      ];
    }
  } else {
    const recommended = getRecommendedServices(filteredServices);
    const items = filteredServices.filter(
      (service) => !isAdvisoryCall(service),
    );

    sections = [
      {
        title: 'Top tests for you',
        subtitle: 'Most recommended',
        services: recommended,
      },
      {
        title: 'Blood test',
        services: items.filter((service) => service.phlebotomy),
      },
      {
        title: 'Other tests',
        services: items.filter((service) => !service.phlebotomy),
      },
    ].filter(({ services }) => services.length > 0);
  }

  if (!filteredServices.length || !sections.length) return null;

  return (
    <div className="flex flex-col gap-14">
      {sections.map(({ title, subtitle, services }) => (
        <ServiceCategory
          key={title}
          title={title}
          subtitle={subtitle}
          services={services}
        />
      ))}
    </div>
  );
};
