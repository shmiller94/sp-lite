import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ImageWithWithBlockLayout } from '@/components/layouts/image-with-block-layout';
import { LoginForm } from '@/features/auth/components/login-form';
import { useGetConsent } from '@/features/consent/api';
import { useAnalytics } from '@/hooks/use-analytics';
import { useUser } from '@/lib/auth';

const RESTRICTED_REDIRECT_ROUTES = ['/users'];

export const LoginRoute = () => {
  const user = useUser();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const { track, identify } = useAnalytics();

  // when we sign in from users (as admin) we don't want to be redirected to the same page
  const shouldRedirect =
    redirectTo !== null && !RESTRICTED_REDIRECT_ROUTES.includes(redirectTo);

  const consentQuery = useGetConsent({
    userId: user.data?.id || '',
  });

  const handleLoginSuccess = (user: any) => {
    // For onSuccess, we need to wait for the consent query to complete
    // since the user just logged in and the consent query might still be loading
    if (!consentQuery.isLoading && consentQuery.data !== undefined) {
      const targetPath = shouldRedirect ? redirectTo : '/';
      const hasConsent = consentQuery.data?.exists;
      const finalPath =
        targetPath === '/' && !hasConsent ? '/?consent=true' : targetPath;

      navigate(finalPath, {
        replace: true,
      });
    }
    // If consent query is still loading, let the useEffect handle navigation
    identify(user.id, {
      $set: {
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        phone: user.phone,
      },
    });
    track('logged_in');
  };

  useEffect(() => {
    // Only proceed if we have user data and the consent query has completed
    if (user.data && user.data.id && !consentQuery.isLoading) {
      const targetPath = shouldRedirect ? redirectTo : '/';

      // Only set consent = true if the user does not have consent stored
      const hasConsent = consentQuery.data?.exists;
      const finalPath =
        targetPath === '/' && !hasConsent ? '/?consent=true' : targetPath;

      navigate(finalPath, {
        replace: true,
      });
    }
  }, [
    user.data,
    navigate,
    shouldRedirect,
    redirectTo,
    consentQuery.data,
    consentQuery.isLoading,
  ]);

  return (
    <ImageWithWithBlockLayout title="Log in">
      <LoginForm onSuccess={handleLoginSuccess} />
    </ImageWithWithBlockLayout>
  );
};
