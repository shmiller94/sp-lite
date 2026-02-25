/**
 * AI Chat API Client
 *
 * Type-safe REST API client for ts-ai-chat using OpenAPI/REST protocol.
 * Requests are proxied through ts-server's /chat endpoint.
 *
 * Usage:
 * ```ts
 * // Direct API calls:
 * const { data } = await aiChatApi.GET('/history');
 * const { data } = await aiChatApi.GET('/{chatId}', {
 *   params: { path: { chatId } }
 * });
 *
 * // React Query hooks:
 * const { data } = $aiChatApi.useQuery('get', '/history');
 * const { data } = $aiChatApi.useQuery('get', '/{chatId}', {
 *   params: { path: { chatId } }
 * });
 * ```
 */
import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';

import { env } from '@/config/env';

import type { paths } from './ai-chat-types.generated';

/**
 * Create a type-safe fetch client for the AI Chat API
 *
 * Requests go through ts-server's /chat proxy which routes to ts-ai-chat
 */
export const aiChatApi = createFetchClient<paths>({
  baseUrl: `${env.API_URL}/`,
  credentials: 'include',
});

/**
 * React Query utilities for the AI Chat API
 *
 * Provides TanStack Query integration for type-safe queries and mutations.
 */
export const $aiChatApi = createClient(aiChatApi);

/**
 * Re-export types for convenience
 */
export type { paths as aiChatPaths } from './ai-chat-types.generated';
export type { components as aiChatComponents } from './ai-chat-types.generated';
