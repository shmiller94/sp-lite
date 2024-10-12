import { Widget } from '@typeform/embed-react';

import { OnboardingLayout } from '@/components/layouts/onboarding-layout';
import { env } from '@/config/env';
import { api } from '@/lib/api-client';
import { useUser } from '@/lib/auth';

export const TypeformIntegration = () => {
  const { data: user } = useUser();
  const { refetch } = useUser();

  const completeOnboarding = async () => {
    await api.put(`users/onboarding`, {
      status: 'COMPLETE',
    });

    await refetch();
    localStorage.removeItem('onboarding');

    /**
     * for some reason typeform doesnt unmount after we get
     * so we use refresh to both navigate user and get rid of typeform
     *
     * useeffect in parent component will also take care of transferring user
     */
    window.location.reload();
  };

  const typeformFormId = env.TYPEFORM_FORM_ID;

  return (
    <section id="main">
      <Widget
        id={typeformFormId}
        className="h-dvh w-full pt-24 sm:h-[80dvh] md:w-[80dvw]"
        opacity={0}
        fullScreen
        transitiveSearchParams={['email']}
        hidden={{
          email: user?.email ?? '',
          user_id: user?.userIdentity?.userId ?? '',
        }}
        onSubmit={completeOnboarding}
      />
    </section>
  );
};

export const TypeformIntegrationStep = () => (
  <OnboardingLayout title="Typeform">
    <TypeformIntegration />
  </OnboardingLayout>
);
