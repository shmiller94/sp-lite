# API Clients and Generated Types

This document describes how to use the OpenAPI-generated types and API clients for making type-safe API calls to the backend services.

## Overview

We have **two API origins** with separate clients and generated types:

| Service                        | Types File                       | Clients                                             | Base URL |
| ------------------------------ | -------------------------------- | --------------------------------------------------- | -------- |
| **ts-server** (Superpower API) | `@/orpc/types.generated`         | `api`, `$api` from `@/orpc/client`                  | `/rpc`   |
| **ts-ai-chat** (AI Chat API)   | `@/orpc/ai-chat-types.generated` | `aiChatApi`, `$aiChatApi` from `@/orpc/ai-chat-api` | `/chat`  |

## Type Extraction

Extract types from the generated `operations` interface:

### ts-server Types

```typescript
import type { operations } from '@/orpc/types.generated';

// Extract response type from a specific operation
type GetAllProtocolsResponse =
  operations['protocol.getAllProtocols']['responses'][200]['content']['application/json'];

// Extract nested types from the response
export type Protocol = GetAllProtocolsResponse['protocols'][number];
export type Goal = Protocol['goals'][number];
```

### ts-ai-chat Types

```typescript
import type { operations } from '@/orpc/ai-chat-types.generated';

// Extract response type from a specific operation
type GetHistoryResponse =
  operations['getHistory']['responses'][200]['content']['application/json'];
```

**Pattern**: `operations['<operationId>']['responses'][<status>]['content']['application/json']`

## Using $api for ts-server

Import from `@/orpc/client` for ts-server endpoints:

```typescript
import { useQuery } from '@tanstack/react-query';
import { $api } from '@/orpc/client';

export function useProtocols() {
  return useQuery({
    ...$api.queryOptions('get', '/protocol'),
    select: (data) => data.protocols,
  });
}
```

### Query with Path Parameters

```typescript
export function useProtocol(protocolId: string) {
  return useQuery({
    ...$api.queryOptions('get', '/protocol/:id', {
      params: {
        path: { id: protocolId },
      },
    }),
    enabled: !!protocolId,
    select: (data) => data.protocol,
  });
}
```

### Query with Query Parameters

```typescript
export function useAuthMethods(email: string) {
  return useQuery({
    ...$api.queryOptions('get', '/auth/methods', {
      params: {
        query: { email },
      },
    }),
    enabled: !!email,
  });
}
```

## Using $aiChatApi for ts-ai-chat

Import from `@/orpc/ai-chat-api` for AI chat endpoints:

```typescript
import { useQuery } from '@tanstack/react-query';
import { $aiChatApi } from '@/orpc/ai-chat-api';

export function useChatHistory() {
  return $aiChatApi.useQuery('get', '/history');
}

export function useChat(chatId: string) {
  return $aiChatApi.useQuery('get', '/{chatId}', {
    params: { path: { chatId } },
  });
}
```

### AI Chat Path Mapping

The ts-ai-chat API is proxied through ts-server's `/chat` endpoint. Paths are transformed:

| Client Path      | ts-ai-chat Path        |
| ---------------- | ---------------------- |
| `/history`       | `/api/v1/history`      |
| `/biomarkers/*`  | `/api/v1/biomarkers/*` |
| `/*` (root)      | `/api/v1/chat/*`       |
| `/protocol-v2/*` | `/api/v1/protocols/*`  |

## Key Benefits

1. **Full Type Safety**: Types are auto-generated from backend Zod schemas
2. **Auto-completion**: IDE provides suggestions for paths and parameters
3. **Compile-time Errors**: TypeScript catches API mismatches before runtime
4. **Consistent Patterns**: Use the same pattern for all API calls

## Common Patterns

### Transforming Data with `select`

Use `select` to transform the response data:

```typescript
return useQuery({
  ...$api.queryOptions('get', '/protocol'),
  select: (data) => data.protocols[0] ?? null, // Return first item or null
});
```

### Conditional Queries with `enabled`

Prevent queries from running until conditions are met:

```typescript
return useQuery({
  ...$api.queryOptions('get', '/protocol/:id', {
    params: { path: { id: protocolId } },
  }),
  enabled: !!protocolId, // Only run when protocolId exists
});
```

### Custom Query Keys

By default, `$api.queryOptions` generates query keys automatically. Override if needed:

```typescript
return useQuery({
  ...$api.queryOptions('get', '/protocol'),
  queryKey: ['protocols', 'custom', 'key'], // Custom key
});
```

## Mutations

For POST/PUT/DELETE operations, use `mutationOptions()`:

### ts-server Mutations

```typescript
import { useMutation } from '@tanstack/react-query';
import { $api } from '@/orpc/client';

export function useCreateCheckout() {
  return useMutation({
    ...$api.mutationOptions('post', '/checkout/create-checkout-session'),
  });
}
```

### ts-ai-chat Mutations

```typescript
import { useMutation } from '@tanstack/react-query';
import { $aiChatApi } from '@/orpc/ai-chat-api';

export function useSendMessage() {
  return useMutation({
    ...$aiChatApi.mutationOptions('post', '/'),
  });
}
```

## Regenerating Types

When backend routes change, regenerate types:

```bash
# In react-app workspace

# Generate types for ts-server only
bun generate:ts-server-types

# Generate types for ts-ai-chat only
bun generate:ts-ai-chat-types

# Generate types for both (recommended)
bun generate:types
```

## Troubleshooting Type Issues

### Step 1: Regenerate Types

If you encounter type errors or mismatches, regenerate the types:

```bash
# In react-app workspace
bun generate:orpc-types
```

### Step 2: Ensure Backend Services are Running

Type generation requires the backend services to be running:

If `bun generate:orpc-types` fails with a connection error, tell the user to ensure that ts-server is running and accessible at the expected URL. Do not try and start ts-server for them.

If a command fails with a connection error, tell the user to ensure the relevant service is running. Do not try to start the services for them.

### Common Type Issues

1. **"Property does not exist on type"** → Run `bun generate:orpc-types`
2. **"Type is not assignable"** → Backend schema changed, regenerate types
3. **"Cannot find module '@/orpc/types.generated'"** → Run `bun generate:orpc-types`
4. **Connection refused during type generation** → Tell the user to ensure that ts-server is running and accessible at the expected URL.

## Anti-Patterns (Don't Do This)

❌ **Don't use raw fetch or axios**

```typescript
// BAD
const response = await fetch('/protocol');
```

❌ **Don't manually construct URLs**

```typescript
// BAD
const url = `${API_URL}/protocol/${id}`;
```

❌ **Don't hardcode response types**

```typescript
// BAD
type Protocol = { id: string; title: string }; // Will get out of sync
```

❌ **Don't mix up the API clients**

```typescript
// BAD - using $api for chat endpoints
const { data } = $api.useQuery('get', '/history'); // Wrong! This is a ts-ai-chat endpoint
```

✅ **Do use the correct client for each service**

```typescript
// GOOD - ts-server endpoints
import { $api } from '@/orpc/client';
const { data } = useQuery({
  ...$api.queryOptions('get', '/protocol/:id', {
    params: { path: { id } },
  }),
});

// GOOD - ts-ai-chat endpoints
import { $aiChatApi } from '@/orpc/ai-chat-api';
const { data } = $aiChatApi.useQuery('get', '/history');
```
