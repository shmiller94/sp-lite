import { useQuery } from '@tanstack/react-query';

import { $api } from '@/orpc/client';
import type { operations } from '@/orpc/types.generated';

// Extract protocol types from the generated operations
type GetAllProtocolsResponse =
  operations['protocol.getAllProtocols']['responses'][200]['content']['application/json'];

export type LegacyProtocol = GetAllProtocolsResponse['protocols'][number];
export type LegacyGoal = LegacyProtocol['goals'][number];
export type LegacyActivity = LegacyProtocol['activities'][number];
export type LegacyCitation = LegacyGoal['citations'][number];

/**
 * LEGACY PROTOCOL: Hook to fetch all completed protocols for the user (sorted by date, newest first)
 */
export function useLegacyProtocols() {
  return useQuery({
    ...$api.queryOptions('get', '/protocol'),
    select: (data) => data.protocols,
  });
}

/**
 * LEGACY PROTOCOL: Hook to fetch the latest protocol for the user
 * This is a convenience hook that returns the first protocol from the sorted list
 */
export function useLegacyLatestProtocol() {
  return useQuery({
    ...$api.queryOptions('get', '/protocol'),
    select: (data) => data.protocols[0] ?? null,
  });
}

/**
 * LEGACY PROTOCOL: Hook to fetch a specific protocol by ID
 * @param protocolId - The protocol ID to fetch
 */
export function useLegacyProtocol(protocolId: string) {
  return useQuery({
    ...$api.queryOptions('get', '/protocol/{id}', {
      params: {
        path: { id: protocolId },
      },
    }),
    enabled: !!protocolId,
    select: (data) => data.protocol,
  });
}
