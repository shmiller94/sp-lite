import { useCallback, useMemo, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import {
  ADVANCED_BLOOD_PANEL,
  CUSTOM_BLOOD_PANEL,
  ENVIRONMENTAL_TOXIN_TEST_ID,
  GUT_MICROBIOME_ANALYSIS_ID,
  HEAVY_METALS_TEST_ID,
  MYCOTOXINS_TEST_ID,
  TOTAL_TOXIN_TEST_ID,
} from '@/const/services';
import {
  ServiceWithMetadata,
  useUpsellServices,
} from '@/features/onboarding/hooks/use-upsell-services';
import { useGroupedOrders } from '@/features/orders/hooks';
import { useAnalytics } from '@/hooks/use-analytics';

import { UpsellCover } from '../upsell-cover';

import { UpsellAddOn } from './upsell-addon';
import { UpsellCheckout } from './upsell-checkout';
import { UpsellItemCover } from './upsell-cover';
import { UpsellDetailGut } from './upsell-detail-gut';
import { UpsellDetailToxins } from './upsell-detail-toxins';

enum STEPS {
  MAIN_COVER = 'MAIN_COVER',
  ADD_ON = 'ADD_ON',
  GUT_COVER = 'GUT_COVER',
  GUT_DETAIL = 'GUT_DETAIL',
  TOXINS_COVER = 'TOXINS_COVER',
  TOXINS_DETAIL = 'TOXINS_DETAIL',
  CHECKOUT = 'CHECKOUT',
}

type STEP = (typeof STEPS)[keyof typeof STEPS];

const UPSELL_STEPS = Object.values(STEPS) as STEP[];

export const UpsellSequence = () => {
  const { track } = useAnalytics();
  const { buckets } = useGroupedOrders();

  const { services, selectedServices, setSelectedServices, isLoading } =
    useUpsellServices();

  const [currentStep, setCurrentStep] = useState<STEP>(STEPS.MAIN_COVER);

  const gutService = useMemo(
    () =>
      services?.find((service) => service.id === GUT_MICROBIOME_ANALYSIS_ID),
    [services],
  );

  const toxinsServices = useMemo(
    () =>
      services?.filter((service) =>
        [
          ENVIRONMENTAL_TOXIN_TEST_ID,
          MYCOTOXINS_TEST_ID,
          HEAVY_METALS_TEST_ID,
          TOTAL_TOXIN_TEST_ID,
        ].includes(service.id),
      ) ?? [],
    [services],
  );

  const toggleService = useCallback(
    (item: ServiceWithMetadata) => {
      track('service_added_to_cart', {
        service_id: item.id,
        service_name: item.name,
        value: item.price,
      });
      setSelectedServices(item);
    },
    [setSelectedServices, track],
  );

  const goToNext = () => {
    const currentIndex = UPSELL_STEPS.indexOf(currentStep);
    if (currentIndex < UPSELL_STEPS.length - 1) {
      let nextStep = UPSELL_STEPS[currentIndex + 1];

      // we currently do not support upgrade of advanced credits sicne they already hit 14 tubes limit
      if (
        buckets.drafts.find((d) => d.order.serviceName === ADVANCED_BLOOD_PANEL)
      ) {
        if (nextStep === STEPS.ADD_ON) {
          nextStep = STEPS.GUT_COVER;
        }
      }

      // if custom blood panel exists already we dont need to show it again
      if (
        buckets.drafts.find((d) => d.order.serviceName === CUSTOM_BLOOD_PANEL)
      ) {
        if (nextStep === STEPS.ADD_ON) {
          nextStep = STEPS.GUT_COVER;
        }
      }

      // Skip gut steps if gut service is already ordered
      if (gutService?.order) {
        if (nextStep === STEPS.GUT_COVER) {
          nextStep = STEPS.TOXINS_COVER;
        } else if (nextStep === STEPS.GUT_DETAIL) {
          nextStep = STEPS.TOXINS_DETAIL;
        }
      }

      setCurrentStep(nextStep);
    }
  };

  if (isLoading)
    return (
      <>
        <div className="mx-auto flex size-full max-w-[512px] flex-col justify-center gap-4 px-4 lg:px-0">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="mb-8 h-10 w-full max-w-56 rounded-xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
        <div className="px-4 lg:px-0">
          <Skeleton className="size-full rounded-2xl" />
        </div>
      </>
    );

  switch (currentStep) {
    case STEPS.MAIN_COVER:
      return <UpsellCover goToNext={goToNext} />;

    case STEPS.ADD_ON:
      return <UpsellAddOn goToNext={goToNext} />;

    case STEPS.GUT_COVER:
      return (
        <UpsellItemCover
          title="Up to 40% of healthy adults show signs of gut microbiome imbalance."
          description="This doesn’t always cause digestive symptoms, but it can lead to issues like fatigue, skin conditions, or mood disorders over time."
          circularProgress={0.4}
          source="NIH Human Microbiome Project"
          foregroundImage="/onboarding/upsell/gut-microbiome-test-foreground.webp"
          backgroundImage="/onboarding/upsell/gut-microbiome-test-background.webp"
          goToNext={goToNext}
        />
      );

    case STEPS.GUT_DETAIL:
      if (gutService) {
        return (
          <UpsellDetailGut
            service={gutService}
            toggleService={toggleService}
            goToNext={goToNext}
          />
        );
      }
      break;

    case STEPS.TOXINS_COVER:
      return (
        <UpsellItemCover
          title="Over 90% of people have hormone-disrupting plastics in their blood."
          description="This doesn’t always cause digestive symptoms, but it can lead to issues like fatigue, skin conditions, or mood disorders over time."
          circularProgress={0.9}
          source="Endocrine Society, 2022"
          foregroundImage="/onboarding/upsell/total-toxin-test-foreground.webp"
          backgroundImage="/onboarding/upsell/total-toxin-test-background.webp"
          goToNext={goToNext}
        />
      );

    case STEPS.TOXINS_DETAIL:
      if (toxinsServices) {
        return (
          <UpsellDetailToxins
            services={toxinsServices}
            selectedServices={selectedServices}
            toggleService={toggleService}
            goToNext={goToNext}
          />
        );
      }
      break;

    case STEPS.CHECKOUT:
      return (
        <UpsellCheckout
          services={services}
          selectedServices={selectedServices}
          toggleService={toggleService}
        />
      );

    default:
      return null;
  }
};
