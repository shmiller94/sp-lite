import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { FhirCarePlan } from '@/types/api';

export const getPlans = (): Promise<{ actionPlans: FhirCarePlan[] }> => {
  return api.get(`/plans`);
};

export const getPlansQueryOptions = () => {
  return queryOptions({
    queryKey: ['plans'],
    queryFn: () => getPlans(),
  });
};

type UsePlansOptions = {
  queryConfig?: QueryConfig<typeof getPlansQueryOptions>;
};

export const usePlans = ({ queryConfig }: UsePlansOptions = {}) => {
  return useQuery({
    ...getPlansQueryOptions(),
    ...queryConfig,
  });
};
