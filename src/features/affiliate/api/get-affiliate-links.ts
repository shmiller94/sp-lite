import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getAffiliateLinks = (): Promise<{ links: string[] }> => {
  return api.get('affiliate-links');
};

export const getAffiliateLinksQueryOptions = () => {
  return queryOptions({
    queryKey: ['affiliate-links'],
    queryFn: () => getAffiliateLinks(),
  });
};

type UseAffiliateLinksOptions = {
  queryConfig?: QueryConfig<typeof getAffiliateLinksQueryOptions>;
};

export const useAffiliateLinks = ({
  queryConfig,
}: UseAffiliateLinksOptions = {}) => {
  return useQuery({
    ...getAffiliateLinksQueryOptions(),
    ...queryConfig,
  });
};
