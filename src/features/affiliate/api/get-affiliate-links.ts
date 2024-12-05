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

/**
 * We enable only in prod because its not available in staging
 * @param queryConfig
 */
export const useAffiliateLinks = (
  { queryConfig }: UseAffiliateLinksOptions = {
    queryConfig: { enabled: import.meta.env.PROD },
  },
) => {
  return useQuery({
    ...getAffiliateLinksQueryOptions(),
    ...queryConfig,
  });
};
