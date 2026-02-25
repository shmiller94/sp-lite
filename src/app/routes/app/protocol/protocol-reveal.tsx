import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';

import { Head } from '@/components/seo';
import { Spinner } from '@/components/ui/spinner';
import { useBiomarkers, useCategories } from '@/features/data/api';
import { useLatestProtocol } from '@/features/protocol/api/protocol';
import { useRevealLatest } from '@/features/protocol/api/reveal';
import { ProtocolProgressBar } from '@/features/protocol/components/protocol-progress-bar';
import {
  getInitialStepForPhase,
  PROTOCOL_STEPS,
  useProtocolStepper,
} from '@/features/protocol/components/reveal/protocol-stepper';
import { ProtocolStepperProvider } from '@/features/protocol/components/reveal/protocol-stepper-context';
import { consumeRevealExitTarget } from '@/features/protocol/components/reveal/reveal-exit';
import {
  ProtocolReadyStep,
  AchieveGoalsStep,
  BenefitsStep,
  SupplementsStep,
  AutopilotStep,
  RestEasyStep,
  HealthJourneyStep,
} from '@/features/protocol/components/reveal/steps/final';
import {
  BuildProtocolStep,
  UnderstandingStep,
  ScienceStep,
  YouDecideStep,
  RealResultsStep,
} from '@/features/protocol/components/reveal/steps/general';
import { BiologicalAgeStep } from '@/features/protocol/components/reveal/steps/intro/biological-age-step';
import { SuperpowerScoreStep } from '@/features/protocol/components/reveal/steps/intro/superpower-score-step';
import { TextSequenceStep } from '@/features/protocol/components/reveal/steps/intro/text-sequence-step';
import { WelcomeStep } from '@/features/protocol/components/reveal/steps/intro/welcome-step';
import {
  GoalOverviewStep,
  GoalDetailStep,
  GoalFixStep,
  GoalRecommendationsStep,
  ProtocolReviewStep,
  ProtocolProcessingStep,
} from '@/features/protocol/components/reveal/steps/key-actions';
import {
  WhatWeDoStep,
  AiModelStep,
  HealthWinnersStep,
  AreasToImproveStep,
} from '@/features/protocol/components/reveal/steps/overview';
import { AreasToImproveBiomarkersStep } from '@/features/protocol/components/reveal/steps/overview/areas-to-improve-biomarkers-step';
import { HealthWinnersBiomarkersStep } from '@/features/protocol/components/reveal/steps/overview/health-winners-biomarkers-step';

/**
 * Route wrapper for the protocol reveal flow
 * Path: /protocol/reveal/:step
 */
export const ProtocolRevealRoute = () => {
  const { step } = useParams({ strict: false }) as { step?: string };
  const navigate = useNavigate();
  const { allSteps } = useProtocolStepper({ currentStepId: step });
  const { data: protocolData, isLoading: isProtocolLoading } =
    useLatestProtocol();
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();
  const { data: biomarkersData, isLoading: isBiomarkersLoading } =
    useBiomarkers();
  const { data: revealData, isLoading: isRevealLoading } = useRevealLatest();

  const isLoading =
    isProtocolLoading || isCategoriesLoading || isBiomarkersLoading;

  const protocol = protocolData?.protocol ?? null;
  const categories = categoriesData?.categories ?? [];
  const biomarkers = biomarkersData?.biomarkers ?? [];
  const lastCompletedPhase = revealData?.lastCompletedPhase ?? 'not_started';

  useEffect(() => {
    // Wait for reveal data to load before deciding where to navigate
    if (isRevealLoading) return;

    // Reveal is fully completed — redirect away
    if (lastCompletedPhase === 'completed') {
      const exitTarget = consumeRevealExitTarget();
      navigate({ to: exitTarget ?? '/protocol', replace: true });
      return;
    }

    // If no step specified, redirect to the appropriate starting point based on phase
    if (!step) {
      const startStep = getInitialStepForPhase(lastCompletedPhase);
      navigate({
        to: '/protocol/reveal/$step',
        params: { step: startStep },
        replace: true,
      });
      return;
    }

    // If step is invalid, redirect to the appropriate starting point
    if (!allSteps.includes(step)) {
      const startStep = getInitialStepForPhase(lastCompletedPhase);
      navigate({
        to: '/protocol/reveal/$step',
        params: { step: startStep },
        replace: true,
      });
    }
  }, [step, allSteps, navigate, lastCompletedPhase, isRevealLoading]);

  // Show loading state while reveal data is loading or step is being determined
  if (isRevealLoading || !step || !allSteps.includes(step)) {
    return (
      <>
        <Head title="Protocol Reveal" />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner variant="primary" />
        </div>
      </>
    );
  }

  const renderCurrentStep = () => {
    switch (step) {
      case PROTOCOL_STEPS.WELCOME:
        return <WelcomeStep />;
      case PROTOCOL_STEPS.VIDEO_SEQUENCE:
        return <TextSequenceStep />;
      case PROTOCOL_STEPS.BIOLOGICAL_AGE:
        return <BiologicalAgeStep />;
      case PROTOCOL_STEPS.SUPERPOWER_SCORE:
        return <SuperpowerScoreStep />;
      case PROTOCOL_STEPS.OVERVIEW_WHAT_WE_DO:
        return <WhatWeDoStep />;
      case PROTOCOL_STEPS.OVERVIEW_AI_MODEL:
        return <AiModelStep />;
      case PROTOCOL_STEPS.OVERVIEW_HEALTH_WINNERS:
        return <HealthWinnersStep />;
      case PROTOCOL_STEPS.OVERVIEW_HEALTH_WINNERS_BIOMARKERS:
        return <HealthWinnersBiomarkersStep />;
      case PROTOCOL_STEPS.OVERVIEW_AREAS_TO_IMPROVE:
        return <AreasToImproveStep />;
      case PROTOCOL_STEPS.OVERVIEW_AREAS_TO_IMPROVE_BIOMARKERS:
        return <AreasToImproveBiomarkersStep />;
      case PROTOCOL_STEPS.GENERAL_BUILD_PROTOCOL:
        return <BuildProtocolStep />;
      case PROTOCOL_STEPS.GENERAL_UNDERSTANDING:
        return <UnderstandingStep />;
      case PROTOCOL_STEPS.GENERAL_SCIENCE:
        return <ScienceStep />;
      case PROTOCOL_STEPS.GENERAL_YOU_DECIDE:
        return <YouDecideStep />;
      case PROTOCOL_STEPS.GENERAL_REAL_RESULTS:
        return <RealResultsStep />;
      case PROTOCOL_STEPS.GOAL_OVERVIEW:
        return <GoalOverviewStep />;
      case PROTOCOL_STEPS.GOAL_DETAIL_1:
        return <GoalDetailStep goalIndex={0} />;
      case PROTOCOL_STEPS.GOAL_FIX_1:
        return <GoalFixStep goalIndex={0} />;
      case PROTOCOL_STEPS.GOAL_RECOMMENDATIONS_1:
        return <GoalRecommendationsStep goalIndex={0} />;
      case PROTOCOL_STEPS.GOAL_DETAIL_2:
        return <GoalDetailStep goalIndex={1} />;
      case PROTOCOL_STEPS.GOAL_FIX_2:
        return <GoalFixStep goalIndex={1} />;
      case PROTOCOL_STEPS.GOAL_RECOMMENDATIONS_2:
        return <GoalRecommendationsStep goalIndex={1} />;
      case PROTOCOL_STEPS.GOAL_DETAIL_3:
        return <GoalDetailStep goalIndex={2} />;
      case PROTOCOL_STEPS.GOAL_FIX_3:
        return <GoalFixStep goalIndex={2} />;
      case PROTOCOL_STEPS.GOAL_RECOMMENDATIONS_3:
        return <GoalRecommendationsStep goalIndex={2} />;
      case PROTOCOL_STEPS.PROTOCOL_REVIEW:
        return <ProtocolReviewStep />;
      case PROTOCOL_STEPS.PROTOCOL_PROCESSING:
        return <ProtocolProcessingStep />;
      case PROTOCOL_STEPS.FINAL_PROTOCOL_READY:
        return <ProtocolReadyStep />;
      case PROTOCOL_STEPS.FINAL_ACHIEVE_GOALS:
        return <AchieveGoalsStep />;
      case PROTOCOL_STEPS.FINAL_BENEFITS:
        return <BenefitsStep />;
      case PROTOCOL_STEPS.FINAL_SUPPLEMENTS:
        return <SupplementsStep />;
      case PROTOCOL_STEPS.FINAL_AUTOPILOT:
        return <AutopilotStep />;
      case PROTOCOL_STEPS.FINAL_REST_EASY:
        return <RestEasyStep />;
      case PROTOCOL_STEPS.FINAL_HEALTH_JOURNEY:
        return <HealthJourneyStep />;
      default:
        return null;
    }
  };

  return (
    <>
      <Head title="Protocol Reveal" />
      <ProtocolStepperProvider
        currentStep={step}
        protocol={protocol}
        categories={categories}
        biomarkers={biomarkers}
        isLoading={isLoading}
      >
        <ProtocolProgressBar currentStep={step} />
        {renderCurrentStep()}
      </ProtocolStepperProvider>
    </>
  );
};
