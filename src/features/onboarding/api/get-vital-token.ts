import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getVitalToken = (): Promise<{ linkToken: string }> => {
  return api.get(`/wearables/vital/token`);
};

export const getQuestionnaireQueryOptions = () => {
  return queryOptions({
    queryKey: ['vitalToken'],
    queryFn: () => getVitalToken(),
  });
};

type UseVitalTokenOptions = {
  queryConfig?: QueryConfig<typeof getQuestionnaireQueryOptions>;
};

export const useVitalToken = ({ queryConfig }: UseVitalTokenOptions) => {
  return useQuery({
    ...getQuestionnaireQueryOptions(),
    ...queryConfig,
  });
};
