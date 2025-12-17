import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { BiomarkerResult } from '@/types/api';

export const getLatestBioAge = async (): Promise<{
  bioAge: BiomarkerResult | null;
}> => {
  return await api.get(`/biomarkers/bioage/latest`);
};

export const getLatestBioAgeQueryOptions = () => {
  return queryOptions({
    queryKey: ['bioage', 'latest'],
    queryFn: () => getLatestBioAge(),
  });
};

type UseLatestBioAgeOptions = {
  queryConfig?: QueryConfig<typeof getLatestBioAgeQueryOptions>;
};

export const useLatestBioAge = ({
  queryConfig,
}: UseLatestBioAgeOptions = {}) => {
  return useQuery({
    ...getLatestBioAgeQueryOptions(),
    ...queryConfig,
  });
};
