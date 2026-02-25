/**
 * Generate TypeScript types from ts-ai-chat's OpenAPI spec
 *
 * This pulls the OpenAPI schema from the running ts-ai-chat service
 * and generates type-safe client types, with paths transformed to match
 * the proxy routing through ts-server's /chat endpoint.
 *
 * Proxy path mapping (client → ts-ai-chat):
 * - /chat/history → /api/v1/history
 * - /chat/biomarkers/* → /api/v1/biomarkers/*
 * - /chat/* → /api/v1/chat/*
 *
 * Run with: yarn generate:ai-chat-types
 */
import fs from 'node:fs';

import openapiTS, { astToString } from 'openapi-typescript';

// Hardcoded to localhost since type generation only happens locally
const AI_CHAT_URL = 'http://localhost:3005';
const specUrl = AI_CHAT_URL + '/spec.json';
const outputPath = './src/orpc/ai-chat-types.generated.ts';

console.log('🔄 Generating AI Chat types from OpenAPI spec...');
console.log('📡 Spec URL:', specUrl);

try {
  // Fetch the spec manually so we can transform the paths
  const response = await fetch(specUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch spec: ${response.status} ${response.statusText}`,
    );
  }
  const spec = await response.json();

  // Transform paths to match proxy routing and filter out non-client routes
  // The proxy strips prefixes, so we need to adjust paths accordingly:
  // /api/v1/history → /history
  // /api/v1/biomarkers/* → /biomarkers/*
  // /api/v1/chat/* → /* (strip /api/v1/chat prefix)
  //
  // Routes that don't match these patterns are excluded (e.g., /healthcheck, /api/v1/shopify)
  // since they're not accessible through the /chat proxy.
  const transformedPaths: Record<string, unknown> = {};
  for (const [path, value] of Object.entries(spec.paths)) {
    let newPath: string | null = null;

    if (path.startsWith('/api/v1/history')) {
      newPath = path.replace('/api/v1', '');
    } else if (path.startsWith('/api/v1/biomarkers')) {
      newPath = path.replace('/api/v1', '');
    } else if (path.startsWith('/api/v1/chat')) {
      newPath = path.replace('/api/v1/chat', '');
      if (newPath === '') newPath = '/';
    } else if (path.startsWith('/api/v1/protocols')) {
      // protocol-v2 proxy: /protocol-v2/* → /api/v1/protocols/*
      newPath = path.replace('/api/v1/protocols', '/protocol-v2');
    }
    // Routes that don't match any pattern are skipped (filtered out)

    if (newPath !== null) {
      transformedPaths[newPath] = value;
    }
  }
  spec.paths = transformedPaths;

  const ast = await openapiTS(spec);
  const contents = astToString(ast);

  // Ensure the output directory exists
  const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, contents);

  console.log('✅ Generated AI Chat types:', outputPath);
  console.log(
    '📝 You can now import types from @/orpc/ai-chat-types.generated',
  );
} catch (error) {
  console.error(
    '❌ Failed to generate types:',
    error instanceof Error ? error.message : String(error),
  );
  console.error(
    '\nMake sure ts-ai-chat is running and accessible at:',
    AI_CHAT_URL,
  );
  process.exit(1);
}
