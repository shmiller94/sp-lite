import { Suspense, useEffect } from 'react';

import { SuperpowerLoadingLogo } from '@/components/icons/superpower-logo';
import { RegisterForm } from '@/features/auth/components/register-form';
import { LazyStripeProvider } from '@/lib/lazy-stripe-provider';

export const RegisterRoute = () => {
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
        <RegisterForm />
      </LazyStripeProvider>
    </Suspense>
  );
};
