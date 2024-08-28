import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { OnboardingLayout } from '@/components/layouts/onboarding-layout';
import { LoginForm } from '@/features/auth/components/login-form';
import { useUser } from '@/lib/auth';
import { TwoFaCode } from '@/shared/components';

export const LoginRoute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showOTP, setShowOTP] = useState(false);
  const redirectTo = searchParams.get('redirectTo');
  const user = useUser();

  return showOTP ? (
    <OnboardingLayout title="2FA">
      <TwoFaCode
        // todo: change for phone later
        phone={user.data?.email ?? ''}
        closeOPT={() => setShowOTP(false)}
        successHandler={() =>
          navigate(`${redirectTo ? `${redirectTo}` : '/app'}`, {
            replace: true,
          })
        }
      />
    </OnboardingLayout>
  ) : (
    <AuthLayout title="Log in">
      <LoginForm onSuccess={() => setShowOTP(true)} />
    </AuthLayout>
  );
};
