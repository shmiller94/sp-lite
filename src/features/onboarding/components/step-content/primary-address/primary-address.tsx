import { OnboardingLayout } from '@/components/layouts/onboarding-layout';
import { Body1, H1 } from '@/components/ui/typography';
import { ContentComingSoon } from '@/features/onboarding/components/coming-soon';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { useUser } from '@/lib/auth';

import { PrimaryAddressForm } from './primary-address-form';

export const PrimaryAddress = () => {
  const { isBlocked } = useOnboarding();
  const { data } = useUser();

  if (isBlocked) {
    return <ContentComingSoon />;
  }

  return (
    <section
      id="main"
      className="mx-auto flex max-w-[500px] flex-col gap-y-12 md:max-w-3xl"
    >
      <div className="space-y-12">
        <div className="space-y-3 text-center">
          <Body1 className="text-white opacity-80">
            Hello {data?.firstName}
          </Body1>
          <H1 className="text-white">
            Where do you live or primarily plan to receive services?
          </H1>
        </div>
        <div className="mx-auto w-full max-w-[400px]">
          <PrimaryAddressForm />
          <div className="h-10" />
        </div>
      </div>
    </section>
  );
};

export const PrimaryAddressStep = () => (
  <OnboardingLayout className="bg-male-large" title="Address">
    <PrimaryAddress />
  </OnboardingLayout>
);
