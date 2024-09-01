import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';

import { MainErrorFallback } from '@/components/errors/main';
import { Spinner } from '@/components/ui/spinner';
import { queryClient } from '@/lib/react-query';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            {import.meta.env.DEV && <ReactQueryDevtools />}
            <Toaster richColors />
            {children}
            {/*<AuthLoader*/}
            {/*  renderLoading={() => (*/}
            {/*    <div className="flex h-screen w-screen items-center justify-center">*/}
            {/*      <Spinner size="xl" />*/}
            {/*    </div>*/}
            {/*  )}*/}
            {/*>*/}
            {/*  {children}*/}
            {/*</AuthLoader>*/}
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
