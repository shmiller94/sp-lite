import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { HealthcareService } from '@/types/api';

export const getService = ({
  serviceId,
}: {
  serviceId: string;
}): Promise<HealthcareService> => {
  return api.get(`/services/${serviceId}`);
};

export const getServiceQueryOptions = (serviceId: string) => {
  return queryOptions({
    queryKey: ['services', serviceId],
    queryFn: () => getService({ serviceId }),
  });
};

type UseServiceOptions = {
  serviceId: string;
  queryConfig?: QueryConfig<typeof getServiceQueryOptions>;
};

export const useService = ({ serviceId, queryConfig }: UseServiceOptions) => {
  return useQuery({
    ...getServiceQueryOptions(serviceId),
    ...queryConfig,
  });
};
