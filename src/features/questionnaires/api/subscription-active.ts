import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { QuestionnaireName } from '@/types/api';

export const getSubscriptionActive = ({
  questionnaireName,
}: {
  questionnaireName: QuestionnaireName;
}): Promise<{
  active: boolean;
}> => {
  return api.get(`/rx/subscription/${questionnaireName}/active`, {
    // The request to ts-server & UI hangs if go-rx isn't responding, so this has it render Not Found after 5 seconds
    timeout: 5000,
  });
};

export const getSubscriptionActiveQueryOptions = (
  questionnaireName: QuestionnaireName,
) => {
  return queryOptions({
    queryKey: ['subscription-active', questionnaireName],
    queryFn: () => getSubscriptionActive({ questionnaireName }),
  });
};

type UseSubscriptionActiveOptions = {
  questionnaireName: QuestionnaireName;
  queryConfig?: QueryConfig<typeof getSubscriptionActiveQueryOptions>;
};

export const useSubscriptionActive = ({
  questionnaireName,
  queryConfig,
}: UseSubscriptionActiveOptions) => {
  return useQuery({
    ...getSubscriptionActiveQueryOptions(questionnaireName),
    ...queryConfig,
  });
};
