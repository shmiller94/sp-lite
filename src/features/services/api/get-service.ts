import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import {
  CollectionMethodType,
  HealthcareService,
  ServiceItem,
} from '@/types/api';

export const getService = ({
  serviceId,
  method,
  items,
}: {
  serviceId: string;
  method: CollectionMethodType | null;
  items?: ServiceItem[];
}): Promise<{ service: HealthcareService }> => {
  const queryParams = new URLSearchParams();

  // if method present, then add CollectionMethod to request (will affect pricing)
  if (method) {
    queryParams.append('method', method);
  }

  // if selected items present, then add them to request (will affect pricing)
  if (items && items.length > 0) {
    items.forEach((item) => queryParams.append('items', item.id));
  }

  const queryString = queryParams.toString();

  // Construct the full URL
  const url = `services/${serviceId}${queryString ? `?${queryString}` : ''}`;

  return api.get(url);
};

export const getServiceQueryOptions = (
  serviceId: string,
  method: CollectionMethodType | null,
  items?: ServiceItem[],
) => {
  return queryOptions({
    queryKey: ['service', serviceId, method],
    queryFn: () => getService({ serviceId, method, items }),
  });
};

type UseServiceOptions = {
  serviceId: string;
  method: CollectionMethodType | null;
  items?: ServiceItem[];
  queryConfig?: QueryConfig<typeof getServiceQueryOptions>;
};

export const useService = ({
  serviceId,
  method,
  items,
  queryConfig,
}: UseServiceOptions) => {
  return useQuery({
    ...getServiceQueryOptions(serviceId, method, items),
    ...queryConfig,
  });
};
