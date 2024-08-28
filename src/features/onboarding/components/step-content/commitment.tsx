import { OnboardingLayout } from '@/components/layouts/onboarding-layout';
import { Button } from '@/components/ui/button';
import { useStepper } from '@/components/ui/stepper';
import { Body1, H1 } from '@/components/ui/typography';

import { SignatureBlock } from '../signature-block';

export const Commitment = () => {
  const { nextStep } = useStepper((s) => s);
  return (
    <section className="mx-auto flex max-w-[500px] flex-col gap-y-12 py-12">
      <div className="flex flex-col space-y-12">
        <div className="space-y-8">
          <H1 className="text-white">Your commitment to health</H1>
          <Body1 className="text-white opacity-60">
            Every member of Superpower makes the same commitment
          </Body1>
          <div className="space-y-6">
            <div className="flex flex-row gap-x-4">
              <p className="text-white opacity-60">1</p>
              <p className="text-white">
                Commit to truly putting your health first, always.
              </p>
            </div>
            <div className="flex flex-row gap-x-4">
              <p className="text-white opacity-60">2</p>
              <p className="text-white">
                Realize that optimal health is a daily journey, not a
                destination.
              </p>
            </div>
            <div className="flex flex-row gap-x-4">
              <p className="text-white opacity-60">3</p>
              <p className="text-white">
                Understand that your health is the foundation to success in your
                career, business, and personal life.
              </p>
            </div>
          </div>
        </div>
        <div>
          <SignatureBlock />
        </div>
        <Button
          onClick={() => nextStep()}
          type="submit"
          className="w-full"
          variant="white"
        >
          Next
        </Button>
      </div>
    </section>
  );
};

export const CommitmentStep = () => (
  <OnboardingLayout className="bg-female-hands" title="Commitment">
    <Commitment />
  </OnboardingLayout>
);
