import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { useUser } from '@/lib/auth';
import { QueryConfig } from '@/lib/react-query';
import { Biomarker } from '@/types/api';

export const getBiomarkers = async ({
  dateOfBirth,
}: {
  dateOfBirth?: string;
  gender?: string;
}): Promise<{ biomarkers: Biomarker[] }> => {
  const response: { biomarkers: Biomarker[] } = await api.get('/biomarkers', {
    params: { dateOfBirth },
  });
  return response;
};

export const getBiomarkersQueryOptions = (dateOfBirth?: string) => {
  return queryOptions({
    queryKey: ['biomarkers'],
    queryFn: () => getBiomarkers({ dateOfBirth }),
  });
};

type UseBiomarkersOptions = {
  queryConfig?: QueryConfig<typeof getBiomarkersQueryOptions>;
};

export const useBiomarkers = ({ queryConfig }: UseBiomarkersOptions = {}) => {
  const { data: user } = useUser();

  return useQuery({
    ...getBiomarkersQueryOptions(user?.dateOfBirth),
    ...queryConfig,
  });
};
