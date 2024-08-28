import { Widget } from '@typeform/embed-react';

import { OnboardingLayout } from '@/components/layouts/onboarding-layout';

export const TypeformIntegration = () => {
  return (
    <section id="main">
      <Widget
        id="CxleN2f4"
        className="h-[80dvh] w-[80dvw]"
        opacity={0}
        enableSandbox
        fullScreen
      />
    </section>
  );
};

export const TypeformIntegrationStep = () => (
  <OnboardingLayout title="Typeform">
    <TypeformIntegration />
  </OnboardingLayout>
);
