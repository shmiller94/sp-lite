import { OnboardingLayout } from '@/components/layouts/onboarding-layout';
import { Button } from '@/components/ui/button';
import { H1 } from '@/components/ui/typography';
import { useStepper } from '@/lib/stepper';

export const Mission = () => {
  const { nextOnboardingStep } = useStepper((s) => s);

  return (
    <section
      id="main"
      className="mx-auto flex max-w-[500px] flex-col gap-y-12 py-20 font-light"
    >
      <div className="flex flex-col space-y-12">
        <div className="space-y-12">
          <div className="my-24 md:my-0">
            <H1 className="text-white">Perform better</H1>
            <H1 className="text-white">Live longer</H1>
          </div>
          <div className="space-y-1">
            <p className="text-white opacity-60">Our Mission</p>
            <p className="text-lg text-white md:text-2xl">
              Our mission is to help you become the healthiest version of
              yourself, and unleash your inner Superpower – for life.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-white opacity-60">
              &quot;Fighting back...&quot;
            </p>
            <p className="text-lg text-white md:text-2xl">
              Healthcare is broken. From poor food quality, to inescapable
              environmental toxins, to a modern lifestyle at odds with our
              biology, it has never been harder to be healthy.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-white opacity-60">A New Paradigm</p>
            <p className="text-lg text-white md:text-2xl">
              Superpower is a new approach to living. We believe in health as a
              lifestyle. Being healthy isn&apos;t solved by a magic pill or
              quick fix, but by the choices we make everyday.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-white opacity-60">Lifelong Partnership</p>
            <p className="text-lg text-white md:text-2xl">
              We make sure you&apos;re guided by experts long-term. Your health
              is personal, but you don&apos;t have to go at it alone.
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            nextOnboardingStep();
          }}
          type="submit"
          className="w-full"
          variant="white"
        >
          Continue
        </Button>
      </div>
    </section>
  );
};

export const MissionStep = () => (
  <OnboardingLayout title="Mission">
    <Mission />
  </OnboardingLayout>
);
