import { useEffect } from 'react';

import { RegisterForm } from '@/features/auth/components/register-form';
import { ConditionalIntercomProvider } from '@/lib/intercom';

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
    <ConditionalIntercomProvider>
      <RegisterForm />
    </ConditionalIntercomProvider>
  );
};
