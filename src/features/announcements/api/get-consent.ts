import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Consent, ConsentType } from '@/types/api';

export const getConsentInputSchema = z.object({
  userId: z.string().min(1, 'This is required.'),
  type: z
    .enum([ConsentType.MEMBERSHIP_AGREEMENT, ConsentType.PHI_MARKETING])
    .optional(),
});

export type GetConsentInput = z.infer<typeof getConsentInputSchema>;

export const getConsent = ({
  userId,
  type,
}: {
  userId: string;
  type?: ConsentType;
}): Promise<Consent> => {
  const params = new URLSearchParams({ userId });
  if (type) {
    params.append('type', type);
  }
  return api.get(`/consent?${params.toString()}`);
};

export const getConsentQueryOptions = (userId: string, type?: ConsentType) => {
  return queryOptions({
    queryKey: ['consent', userId, type],
    queryFn: () => getConsent({ userId, type }),
    enabled: !!userId,
  });
};

type UseGetConsentOptions = {
  userId: string;
  type?: ConsentType;
  queryConfig?: QueryConfig<typeof getConsentQueryOptions>;
};

export const useGetConsent = ({
  userId,
  type,
  queryConfig,
}: UseGetConsentOptions) => {
  return useQuery({
    ...getConsentQueryOptions(userId, type),
    ...queryConfig,
  });
};
