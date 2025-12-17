import { SuperpowerLogo } from '@/components/icons/superpower-logo';
import { SplitScreenLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { Body1, Body2, H2, H3, H4 } from '@/components/ui/typography';
import { ORGAN_AGE_PANEL } from '@/const';
import { useServices } from '@/features/services/api';
import { useUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { formatMoney } from '@/utils/format-money';

import { useAddOnPanelStore } from '../../stores/add-on-panel-store';

import { useOnboardingStepper } from './onboarding-stepper';

const ORGAN_AGE_PRICE = 9900;

const OrganAgeContent = () => {
  const { next } = useOnboardingStepper();
  const { togglePanel } = useAddOnPanelStore();
  const { data, isLoading: isServicesLoading } = useServices({
    group: 'phlebotomy',
  });

  const handleAddPanel = async () => {
    const organAge = data?.services.find((s) => s.name === ORGAN_AGE_PANEL);

    if (organAge) {
      togglePanel(organAge.id);
    }

    next();
  };

  const handleSkip = () => {
    next();
  };

  if (isServicesLoading) {
    return null;
  }

  const organAgePanel = data?.services.find((s) => s.name === ORGAN_AGE_PANEL);

  if (!organAgePanel) {
    next();
    return null;
  }

  return (
    <>
      <div className="hidden w-full flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-10 lg:sticky lg:top-8 lg:flex lg:self-start">
        <Body1 className="text-zinc-500">One-time upgrade</Body1>
        <ProductInfo />
        <ServiceInfoCard className="block md:hidden" />
      </div>
      <div className="w-full space-y-6 p-4 md:p-10">
        <div className="flex justify-start md:justify-end">
          <SuperpowerLogo />
        </div>
        <div className="space-y-2">
          <H2>Calculate your OrganAge</H2>
          <Body1 className="text-zinc-500">
            Understand how each of your body&apos;s major systems is aging, from
            heart and metabolism to brain and immune health.
          </Body1>

          <ProductInfo className="lg:hidden" />
        </div>
        <div className="space-y-2">
          <H3 className="m-0 text-zinc-900">Precision aging insights</H3>
          <Body1 className="text-zinc-500">
            OrganAge measures how old your body functions, not just how many
            years you&apos;ve lived. It analyzes biomarkers across key systems
            like metabolism, inflammation, liver, and kidney health to create a
            precise map of your biological aging.
          </Body1>
        </div>
        <div className="space-y-2">
          <H4 className="m-0 text-zinc-900">
            Developed from world leading science
          </H4>
          <Body1 className="text-zinc-500">
            Powered by Cosmica Bio, OrganAge is trained on hundreds of thousands
            of data sets to link your biomarker profile with real-world outcomes
            like longevity and disease risk.
          </Body1>
        </div>
        <div className="space-y-2">
          <H4 className="m-0 text-zinc-900">
            See what&apos;s driving your results
          </H4>
          <Body1 className="text-zinc-500">
            Unlike generic BioAge tests, OrganAge reveals how each system in
            your body is aging and which biomarkers are contributing most.
            You&apos;ll see where you&apos;re aging faster or slower than
            expected, and what&apos;s driving it, from inflammation to metabolic
            stress.
          </Body1>
        </div>
        <div className="flex items-center gap-2">
          <Body2 className="text-zinc-500">Built with</Body2>
          <img
            src="/affiliate/cosmica-logo.webp"
            alt="organ-age"
            className="pointer-events-none h-[1em] object-contain"
          />
        </div>
        <ServiceInfoCard className="block md:hidden" />

        <div className="flex flex-col gap-2">
          <Button onClick={handleAddPanel}>
            Add Organ Age Panel - {formatMoney(organAgePanel.price)}
          </Button>
          <Button variant="outline" className="bg-white" onClick={handleSkip}>
            Skip for now
          </Button>
          <div className="flex gap-6 pt-4 text-xs text-zinc-400">
            <a
              href="https://www.superpower.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-150 hover:text-zinc-500"
            >
              Privacy Policy
            </a>
            <a
              href="https://www.superpower.com/terms"
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-150 hover:text-zinc-500"
            >
              Terms of services
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const ProductInfo = ({ className }: { className?: string }) => {
  const { data: user } = useUser();

  // Determine splash image based on gender
  const splashImage =
    user?.gender?.toLowerCase() === 'female'
      ? '/onboarding/splash/organ-age-splash-female.webp'
      : '/onboarding/splash/organ-age-splash-male.webp';

  return (
    <div className={cn('space-y-2 lg:space-y-4', className)}>
      <div className="relative">
        <img
          src={splashImage}
          alt="organ-age"
          className="pointer-events-none mx-auto w-full rounded-[20px] object-contain"
        />
        <div className="absolute bottom-6 left-6">
          <H4 className="text-white">
            Uncover your biological age across 9 key organs
          </H4>
          <H4 className="text-white">to understand how your body is aging.</H4>
        </div>
      </div>
      <ServiceInfoCard className="hidden md:block" />
      <div className="flex flex-col items-center justify-center gap-2 lg:hidden">
        <Body1 className="text-zinc-500">One time Upgrade</Body1>
        <div className="w-full space-y-2">
          <Body1 className="text-zinc-500">
            Uncover your biological age across 9 key systems to target
            what&apos;s really driving your health.
          </Body1>
        </div>
      </div>
    </div>
  );
};

const ServiceInfoCard = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'bg-white p-5 rounded-[20px] border border-zinc-200',
        className,
      )}
    >
      <div className="flex flex-row items-center justify-between gap-4">
        <img
          src="/onboarding/tubes/organ-age-tube.png"
          alt="organ-age"
          className="pointer-events-none size-16 object-contain"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Body1>Organ Age Panel</Body1>
          <Body2 className="text-zinc-500">Diagnostic Test</Body2>
        </div>
        <Body1>{formatMoney(ORGAN_AGE_PRICE)}</Body1>
      </div>
    </div>
  );
};

export const OrganAgeStep = () => (
  <SplitScreenLayout title="Upgrade" className="bg-zinc-50">
    <OrganAgeContent />
  </SplitScreenLayout>
);
