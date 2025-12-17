import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

import { UpgradeCreditInput } from './upgrade-credit';

type UpgradeType = UpgradeCreditInput['upgradeType'];

type GetUpgradeCreditPriceParams = {
  upgradeType: UpgradeType;
  creditIds?: string[];
};

export const getUpgradeCreditPrice = ({
  upgradeType,
  creditIds,
}: GetUpgradeCreditPriceParams): Promise<{ price: number }> => {
  return api.get('/credits/upgrade/price', {
    params: {
      upgradeType,
      creditIds,
    },
  });
};

export const getUpgradeCreditPriceQueryOptions = ({
  upgradeType,
  creditIds,
}: GetUpgradeCreditPriceParams) => {
  const normalizedCreditIds = creditIds ? [...creditIds].sort() : [];

  return queryOptions({
    queryKey: ['credits', 'upgrade', 'price', upgradeType, normalizedCreditIds],
    queryFn: () => getUpgradeCreditPrice({ upgradeType, creditIds }),
    // on purpose disable caching just in case
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
};

type UseCreditsOptions = GetUpgradeCreditPriceParams & {
  queryConfig?: QueryConfig<typeof getUpgradeCreditPriceQueryOptions>;
};

export const useUpgradeCreditPrice = ({
  upgradeType,
  creditIds,
  queryConfig,
}: UseCreditsOptions) => {
  return useQuery({
    ...getUpgradeCreditPriceQueryOptions({ upgradeType, creditIds }),
    ...queryConfig,
  });
};
