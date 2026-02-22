import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

import { MainErrorFallback } from '@/components/errors/main';
import { Toaster } from '@/components/ui/sonner';
import { PHProvider } from '@/lib/posthog';
import { queryConfig } from '@/lib/react-query';

type AppProviderProps = {
  children: React.ReactNode;
};

const ReactQueryDevtools = import.meta.env.DEV
  ? React.lazy(() =>
      import('@tanstack/react-query-devtools').then((mod) => ({
        default: mod.ReactQueryDevtools,
      })),
    )
  : null;

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <PHProvider>
            {ReactQueryDevtools ? (
              <React.Suspense fallback={null}>
                <ReactQueryDevtools buttonPosition="top-right" />
              </React.Suspense>
            ) : null}
            <Toaster />
            {children}
          </PHProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};
