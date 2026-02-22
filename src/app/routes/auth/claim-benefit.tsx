import { Suspense, lazy, useEffect } from 'react';

import { SuperpowerLoadingLogo } from '@/components/icons/superpower-logo';
import { ClaimBenefitForm } from '@/features/auth/components/b2b-benefits/claim-benefit-form';

const LazyStripeProvider = lazy(() =>
  import('@/lib/stripe').then((mod) => ({ default: mod.StripeProvider })),
);

export const ClaimBenefitRoute = () => {
  // this is basic hook to prevent refreshses during checkout operation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Required for Chrome
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <SuperpowerLoadingLogo />
          <span className="sr-only">Loading</span>
        </div>
      }
    >
      <LazyStripeProvider>
        <ClaimBenefitForm />
      </LazyStripeProvider>
    </Suspense>
  );
};
