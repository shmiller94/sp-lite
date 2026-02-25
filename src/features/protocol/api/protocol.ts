import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { $aiChatApi, aiChatApi } from '@/orpc/ai-chat-api';
import type { operations } from '@/orpc/ai-chat-types.generated';

// Extract protocol types from the generated operations
type LatestProtocolResponse =
  operations['v1.protocols.latest']['responses'][200]['content']['application/json'];
export type Protocol = NonNullable<LatestProtocolResponse['protocol']>;
export type ProtocolGoal = Protocol['goals'][number];
export type ProtocolAction = ProtocolGoal['primaryAction'];
export type ProtocolActionContent = ProtocolAction['content'];
export type ProtocolCitation = NonNullable<ProtocolAction['citations']>[number];

/**
 * Hook to fetch the latest protocol for the user
 */
export function useLatestProtocol() {
  return $aiChatApi.useQuery('get', '/protocol-v2/latest');
}

/**
 * Hook to fetch a specific protocol by ID
 * @param protocolId - The protocol ID to fetch
 */
export function useProtocol(protocolId: string | undefined) {
  return $aiChatApi.useQuery(
    'get',
    '/protocol-v2/{protocolId}',
    {
      params: { path: { protocolId: protocolId! } },
    },
    {
      enabled: !!protocolId,
    },
  );
}

type ProtocolStatus = 'draft' | 'active' | 'completed' | 'revoked';

/**
 * Hook to fetch all protocols for the user
 * @param status - Optional status filter
 */
export function useProtocols(status?: ProtocolStatus) {
  return useQuery({
    queryKey: ['protocol-v2', status],
    queryFn: async () => {
      const { data } = await aiChatApi.GET('/protocol-v2', {
        params: { query: { status } },
      });
      return data;
    },
    select: (data) => data?.protocols,
  });
}

/**
 * Hook to update action acceptance state
 * Calls PATCH /protocol-v2/{protocolId}/actions/{actionId}
 */
export function useUpdateActionAcceptance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      protocolId,
      actionId,
      accepted,
    }: {
      protocolId: string;
      actionId: string;
      accepted: boolean;
    }) => {
      const { data, error } = await aiChatApi.PATCH(
        '/protocol-v2/{protocolId}/actions/{actionId}',
        {
          params: { path: { protocolId, actionId } },
          body: { accepted },
        },
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some(
            (key) => typeof key === 'string' && key.includes('protocol-v2'),
          ),
      });
    },
  });
}
