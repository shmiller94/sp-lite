import { createFileRoute } from '@tanstack/react-router';
import { Outlet, useRouterState } from '@tanstack/react-router';
import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { AppLayout } from '@/components/layouts/app-layout';
import { Spinner } from '@/components/ui/spinner';
import { ProtectedRoute } from '@/lib/auth';
import { LazyStripeProvider } from '@/lib/lazy-stripe-provider';

export const Route = createFileRoute('/_app')({
  component: AppComponent,
});

function AppComponent() {
  return (
    <ProtectedRoute>
      <AppRootComponent />
    </ProtectedRoute>
  );
}

function AppRootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const stripeRoutePrefixes = [
    '/schedule',
    '/orders',
    '/services',
    '/onboarding',
    '/questionnaire',
    '/settings',
    '/protocol/reveal',
  ];

  let needsStripe = false;
  for (const prefix of stripeRoutePrefixes) {
    if (pathname.startsWith(prefix)) {
      needsStripe = true;
      break;
    }
  }

  let content: ReactNode = <Outlet />;

  if (needsStripe) {
    content = (
      <LazyStripeProvider>
        <Outlet />
      </LazyStripeProvider>
    );
  }

  return (
    <AppLayout>
      <Suspense
        fallback={
          <div className="flex size-full items-center justify-center">
            <Spinner size="xl" variant="primary" />
          </div>
        }
      >
        <ErrorBoundary
          key={pathname}
          fallback={<div>Something went wrong!</div>}
        >
          {content}
        </ErrorBoundary>
      </Suspense>
    </AppLayout>
  );
}
