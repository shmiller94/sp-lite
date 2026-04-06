import { AnimatePresence, m } from 'framer-motion';
import { ComponentType, useEffect, useMemo, useRef } from 'react';

import { Head } from '@/components/seo';
import { GUT_MICROBIOME_ANALYSIS, ORGAN_AGE_PANEL } from '@/const/services';
import { useCredits } from '@/features/orders/api/credits';
import { useRecommendations } from '@/features/recommendations/api/recommendations';
import { useServices } from '@/features/services/api';
import { useAnalytics } from '@/hooks/use-analytics';

import { useOnboardingNavigation } from '../../../hooks/use-onboarding-navigation';
import {
  useScreenSequence,
  SequenceProvider,
} from '../../../hooks/use-screen-sequence';
import { Sequence } from '../../sequence';

import { IntroStep } from './intro-step';
import {
  OrganAgeDetail,
  HeartDetail,
  FertilityDetail,
  MetabolicDetail,
  NutrientsDetail,
  AutoimmuneDetail,
  MethylationDetail,
  GutMicrobiomeDetail,
} from './panels';
import {
  type PanelId,
  PanelIdProvider,
  UpsellPanelIdsProvider,
} from './shared/panel-id-context';

const FADE_TRANSITION = { duration: 0.2 };

/** Maximum number of recommendation-driven panels to show before append-only upsells. */
const MAX_RECOMMENDED_PANELS = 2;

/**
 * Maps recommendation product ID prefixes to panel IDs.
 * Product IDs from the recommendations API include version suffixes
 * (e.g. "v2-cardiovascular-bundle-20250929"), so we match by prefix.
 */
const PRODUCT_ID_PREFIX_TO_PANEL_ID: Record<string, PanelId> = {
  'v2-cardiovascular-bundle': 'heart',
  'v2-fertility-bundle': 'fertility',
  'v2-metabolic-bundle': 'metabolic',
  'v2-nutrients-bundle': 'nutrients',
  'v2-autoimmunity-bundle': 'autoimmune',
  'v2-methylation-bundle': 'methylation',
};

type PanelStep = {
  id: PanelId;
  detail: ComponentType;
};

const ALL_PANEL_STEPS: PanelStep[] = [
  { id: 'heart', detail: HeartDetail },
  { id: 'fertility', detail: FertilityDetail },
  { id: 'metabolic', detail: MetabolicDetail },
  { id: 'nutrients', detail: NutrientsDetail },
  { id: 'autoimmune', detail: AutoimmuneDetail },
  { id: 'methylation', detail: MethylationDetail },
  { id: 'organ-age', detail: OrganAgeDetail },
  { id: 'gut-microbiome', detail: GutMicrobiomeDetail },
];

const withPanelId = (Component: ComponentType, panelId: PanelId) => {
  const Wrapped = () => (
    <PanelIdProvider value={panelId}>
      <Component />
    </PanelIdProvider>
  );
  Wrapped.displayName = `PanelId(${panelId})`;
  return Wrapped;
};

export const UpsellSequence = () => {
  const { next: exitSequence, prev: exitBack } = useOnboardingNavigation();
  const {
    data: recommendations,
    isLoading: isRecommendationsLoading,
    isSuccess: hasRecommendations,
  } = useRecommendations();
  const { data: creditsData, isLoading: isCreditsLoading } = useCredits();
  const { data: servicesData, isLoading: isServicesLoading } = useServices();
  const { track } = useAnalytics();
  const trackedPanelsRef = useRef<string | null>(null);
  const isUpsellDataLoading =
    isRecommendationsLoading || isCreditsLoading || isServicesLoading;

  const { steps, panelIds, panelKey } = useMemo(() => {
    const panelMap = new Map(ALL_PANEL_STEPS.map((p) => [p.id, p]));
    const credits = creditsData?.credits ?? [];
    const services = servicesData?.services ?? [];

    let userHasOrganAge = false;
    let userHasGutMicrobiome = false;
    for (const credit of credits) {
      if (credit.serviceName === ORGAN_AGE_PANEL) {
        userHasOrganAge = true;
      }
      if (credit.serviceName === GUT_MICROBIOME_ANALYSIS) {
        userHasGutMicrobiome = true;
      }
    }

    let hasOrganAgeService = false;
    let hasGutMicrobiomeService = false;
    for (const service of services) {
      if (service.name === ORGAN_AGE_PANEL) {
        hasOrganAgeService = true;
      }
      if (service.name === GUT_MICROBIOME_ANALYSIS) {
        hasGutMicrobiomeService = true;
      }
    }

    // Resolve recommended product IDs to panel IDs, preserving recommendation order
    const recommendedPanelIds: PanelId[] = [];
    for (const product of recommendations?.products ?? []) {
      for (const prefix in PRODUCT_ID_PREFIX_TO_PANEL_ID) {
        if (!product.productId.startsWith(prefix)) {
          continue;
        }
        recommendedPanelIds.push(PRODUCT_ID_PREFIX_TO_PANEL_ID[prefix]);
        break;
      }
    }

    // Take top N recommendations, then append organ-age and gut when eligible.
    const panelIdsToShow: PanelId[] = [];
    for (const panelId of recommendedPanelIds) {
      if (panelIdsToShow.length >= MAX_RECOMMENDED_PANELS) {
        break;
      }
      if (panelIdsToShow.includes(panelId)) {
        continue;
      }
      panelIdsToShow.push(panelId);
    }

    if (hasOrganAgeService && !userHasOrganAge) {
      panelIdsToShow.push('organ-age');
    }
    if (hasGutMicrobiomeService && !userHasGutMicrobiome) {
      panelIdsToShow.push('gut-microbiome');
    }

    // Build panel steps in the final sequence order.
    const selectedPanels: PanelStep[] = [];
    const ids: PanelId[] = [];
    for (const panelId of panelIdsToShow) {
      if (ids.includes(panelId)) {
        continue;
      }
      const panel = panelMap.get(panelId);
      if (panel == null) {
        continue;
      }
      selectedPanels.push(panel);
      ids.push(panel.id);
    }

    const panelSteps: ComponentType[] = [IntroStep];
    for (const panel of selectedPanels) {
      panelSteps.push(withPanelId(panel.detail, panel.id));
    }

    return {
      steps: panelSteps,
      panelIds: ids,
      panelKey: ids.join(','),
    };
  }, [creditsData, recommendations, servicesData]);

  // Track which panels were shown (once recommendations have loaded, ref guard prevents duplicate tracking).
  useEffect(() => {
    if (
      !hasRecommendations ||
      isCreditsLoading ||
      isServicesLoading ||
      !panelKey ||
      trackedPanelsRef.current === panelKey
    )
      return;
    trackedPanelsRef.current = panelKey;
    track('upsell_panels_shown', { panel_ids: panelIds });
  }, [
    hasRecommendations,
    isCreditsLoading,
    isServicesLoading,
    panelKey,
    panelIds,
    track,
  ]);

  const { Screen, screenIndex, sequenceValue } = useScreenSequence({
    screens: steps,
    onComplete: isUpsellDataLoading ? undefined : exitSequence,
    onBack: exitBack,
  });

  return (
    <UpsellPanelIdsProvider value={panelIds}>
      <SequenceProvider value={sequenceValue}>
        <Head title="Build Your Testing Plan" />
        <Sequence.Layout>
          <AnimatePresence mode="wait">
            <m.div
              key={screenIndex}
              className="flex min-h-0 flex-1 flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={FADE_TRANSITION}
            >
              <Screen />
            </m.div>
          </AnimatePresence>
        </Sequence.Layout>
      </SequenceProvider>
    </UpsellPanelIdsProvider>
  );
};
