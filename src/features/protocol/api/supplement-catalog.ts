import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';

export type SupplementCatalogItem = {
  shopifyVariantId: string;
  name: string;
  handle: string;
  amazonPrice: number;
  amazonUrl: string;
};

type SupplementCatalogResponse = {
  catalog: SupplementCatalogItem[];
};

export const getSupplementCatalogQueryOptions = () =>
  queryOptions({
    queryKey: ['supplement-catalog'],
    queryFn: async (): Promise<SupplementCatalogItem[]> => {
      const response = (await api.get(
        '/shop/supplement-catalog',
      )) as SupplementCatalogResponse;
      return response.catalog;
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 1 day
  });

export const useSupplementCatalog = () => {
  return useQuery(getSupplementCatalogQueryOptions());
};
