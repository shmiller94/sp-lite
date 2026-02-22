import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet, useLocation } from 'react-router';

import { AppLayout } from '@/components/layouts/app-layout';
import { Spinner } from '@/components/ui/spinner';
import { StripeProvider } from '@/lib/stripe';

export const AppRoot = () => {
  const location = useLocation();
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
    if (location.pathname.startsWith(prefix)) {
      needsStripe = true;
      break;
    }
  }

  let content: ReactNode = <Outlet />;

  if (needsStripe) {
    content = (
      <StripeProvider>
        <Outlet />
      </StripeProvider>
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
          key={location.pathname}
          fallback={<div>Something went wrong!</div>}
        >
          {content}
        </ErrorBoundary>
      </Suspense>
    </AppLayout>
  );
};
