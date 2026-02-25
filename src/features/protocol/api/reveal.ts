import { useMutation, useQueryClient } from '@tanstack/react-query';

import { $aiChatApi, aiChatApi } from '@/orpc/ai-chat-api';
import type { operations } from '@/orpc/ai-chat-types.generated';

type RevealLatestResponse =
  operations['v1.protocolReveal.latest']['responses'][200]['content']['application/json'];
type MarkPhaseParams =
  operations['v1.protocolReveal.markPhaseComplete']['parameters']['path'];

export type RevealPhase = MarkPhaseParams['phase'];
export type ProtocolReveal = NonNullable<RevealLatestResponse['reveal']>;

export const revealLatestQueryOptions = () =>
  $aiChatApi.queryOptions('get', '/protocol-v2/reveal/latest', {});

const REVEAL_LATEST_KEY = revealLatestQueryOptions().queryKey;

interface UseRevealLatestOptions {
  enabled?: boolean;
}

/**
 * Get latest revealable protocol and its reveal state
 */
export function useRevealLatest({ enabled }: UseRevealLatestOptions = {}) {
  return $aiChatApi.useQuery(
    'get',
    '/protocol-v2/reveal/latest',
    {},
    { enabled },
  );
}

/**
 * Mark a reveal phase as complete
 */
export function useMarkPhaseComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      protocolId,
      phase,
    }: {
      protocolId: string;
      phase: RevealPhase;
    }) => {
      const { data, error } = await aiChatApi.POST(
        '/protocol-v2/reveal/{protocolId}/phase/{phase}',
        { params: { path: { protocolId, phase } } },
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVEAL_LATEST_KEY });
    },
  });
}

/**
 * Save Shopify draft order info
 */
export function useSaveShopifyOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      protocolId,
      draftOrderId,
      invoiceUrl,
    }: {
      protocolId: string;
      draftOrderId: string;
      invoiceUrl: string;
    }) => {
      const { data, error } = await aiChatApi.POST(
        '/protocol-v2/reveal/{protocolId}/shopify',
        {
          params: { path: { protocolId } },
          body: { draftOrderId, invoiceUrl },
        },
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVEAL_LATEST_KEY });
    },
  });
}

/**
 * Reset (delete) a reveal record so the user starts fresh.
 * Only works in non-production environments.
 */
export function useResetReveal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (protocolId: string) => {
      const { data, error } = await aiChatApi.DELETE(
        '/protocol-v2/reveal/{protocolId}',
        { params: { path: { protocolId } } },
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVEAL_LATEST_KEY });
    },
  });
}

/**
 * Mark reveal as complete (shorthand for markPhase('completed'))
 */
export function useCompleteReveal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (protocolId: string) => {
      const { data, error } = await aiChatApi.POST(
        '/protocol-v2/reveal/{protocolId}/phase/{phase}',
        { params: { path: { protocolId, phase: 'completed' } } },
      );
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Synchronously update the cache so app-level reveal guards see
      // lastCompletedPhase = 'completed' before navigation triggers
      // a re-render. We skip immediate invalidation to avoid a
      // read-after-write race when the backend hasn't updated yet.
      queryClient.setQueryData(
        REVEAL_LATEST_KEY,
        (old: RevealLatestResponse | undefined) =>
          old
            ? {
                ...old,
                lastCompletedPhase: 'completed',
                reveal: data?.reveal ?? old.reveal,
              }
            : old,
      );
    },
  });
}
