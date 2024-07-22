import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Consult } from '@/types/api';

export const getConsult = ({
  consultId,
}: {
  consultId: string;
}): Promise<Consult> => {
  return api.get(`/consults/${consultId}`);
};

export const getConsultQueryOptions = (consultId: string) => {
  return queryOptions({
    queryKey: ['consults', consultId],
    queryFn: () => getConsult({ consultId }),
  });
};

type UseConsultOptions = {
  consultId: string;
  queryConfig?: QueryConfig<typeof getConsultQueryOptions>;
};

export const useConsult = ({ consultId, queryConfig }: UseConsultOptions) => {
  return useQuery({
    ...getConsultQueryOptions(consultId),
    ...queryConfig,
  });
};
