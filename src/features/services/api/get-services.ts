import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { HealthcareService, ServiceGroup } from '@/types/api';

export const getServices = async ({
  group,
}: {
  group?: ServiceGroup;
}): Promise<{
  services: HealthcareService[];
}> => {
  const params: Record<string, string> = {};

  if (group) {
    params.group = group;
  }

  return await api.get('/services', { params });
};

export const getServicesQueryOptions = ({
  group,
}: {
  group?: ServiceGroup;
} = {}) => {
  return queryOptions({
    queryKey: ['services', group],
    queryFn: () => getServices({ group }),
    // this is on purpose to remove issues with credits / etc
    // added oct 7, 2025 by NM
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
};

type UseServicesOptions = {
  group?: ServiceGroup;
  queryConfig?: QueryConfig<typeof getServicesQueryOptions>;
};

export const useServices = ({
  queryConfig,
  group,
}: UseServicesOptions = {}) => {
  return useQuery({
    ...getServicesQueryOptions({ group }),
    ...queryConfig,
  });
};
