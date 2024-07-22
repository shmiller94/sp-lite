import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Biomarker } from '@/types/api';

export const getBiomarkers = (): Promise<Biomarker[]> => {
  return api.get('/biomarkers');
};

export const getBiomarkersQueryOptions = () => {
  return queryOptions({
    queryKey: ['biomarkers'],
    queryFn: () => getBiomarkers(),
  });
};

type UseBiomarkersOptions = {
  queryConfig?: QueryConfig<typeof getBiomarkersQueryOptions>;
};

export const useBiomarkers = ({ queryConfig }: UseBiomarkersOptions = {}) => {
  return useQuery({
    ...getBiomarkersQueryOptions(),
    ...queryConfig,
  });
};
