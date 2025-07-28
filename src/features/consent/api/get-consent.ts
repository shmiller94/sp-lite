import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getConsentInputSchema = z.object({
  userId: z.string().min(1, 'Required'),
});

export type GetConsentInput = z.infer<typeof getConsentInputSchema>;

export const getConsent = ({
  userId,
}: {
  userId: string;
}): Promise<{ exists: boolean }> => {
  return api.get(`/consent?userId=${userId}`);
};

export const getConsentQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ['consent', userId],
    queryFn: () => getConsent({ userId }),
    enabled: !!userId,
  });
};

type UseGetConsentOptions = {
  userId: string;
  queryConfig?: QueryConfig<typeof getConsentQueryOptions>;
};

export const useGetConsent = ({
  userId,
  queryConfig,
}: UseGetConsentOptions) => {
  return useQuery({
    ...getConsentQueryOptions(userId),
    ...queryConfig,
  });
};
