import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { CollectionMethodType, HealthcareService } from '@/types/api';

export const getService = ({
  serviceId,
  method,
  addOnServiceIds,
}: {
  serviceId: string;
  method: CollectionMethodType | null;
  addOnServiceIds?: string[];
}): Promise<{ service: HealthcareService }> => {
  const queryParams = new URLSearchParams();

  // if method present, then add CollectionMethod to request (will affect pricing)
  if (method) {
    queryParams.append('method', method);
  }

  // if selected items present, then add them to request (will affect pricing)
  if (addOnServiceIds && addOnServiceIds.length > 0) {
    addOnServiceIds.forEach((id) => queryParams.append('addOnServiceIds', id));
  }

  const queryString = queryParams.toString();

  // Construct the full URL
  const url = `services/${serviceId}${queryString ? `?${queryString}` : ''}`;

  return api.get(url);
};

export const getServiceQueryOptions = (
  serviceId: string,
  method: CollectionMethodType | null,
  addOnServiceIds?: string[],
) => {
  return queryOptions({
    queryKey: ['service', serviceId, method, addOnServiceIds],
    queryFn: () => getService({ serviceId, method, addOnServiceIds }),
    // this is on purpose to remove issues with credits / etc
    // added oct 7, 2025 by NM
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
};

type UseServiceOptions = {
  serviceId: string;
  method: CollectionMethodType | null;
  addOnServiceIds?: string[];
  queryConfig?: QueryConfig<typeof getServiceQueryOptions>;
};

export const useService = ({
  serviceId,
  method,
  addOnServiceIds,
  queryConfig,
}: UseServiceOptions) => {
  return useQuery({
    ...getServiceQueryOptions(serviceId, method, addOnServiceIds),
    ...queryConfig,
  });
};
