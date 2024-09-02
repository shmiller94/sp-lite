import { Widget } from '@typeform/embed-react';
import { useNavigate } from 'react-router-dom';

import { OnboardingLayout } from '@/components/layouts/onboarding-layout';
import { api } from '@/lib/api-client';
import { useUser } from '@/lib/auth';

export const TypeformIntegration = () => {
  const navigate = useNavigate();
  const { refetch } = useUser();

  const completeOnboarding = async () => {
    await api.put(`users/onboarding`, {
      status: 'COMPLETE',
    });

    await refetch();
    localStorage.removeItem('onboarding');
    navigate('/app', {
      replace: true,
    });
  };

  return (
    <section id="main">
      <Widget
        id="VVOeB9wb"
        className="h-[80dvh] w-[80dvw]"
        opacity={0}
        enableSandbox
        fullScreen
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
