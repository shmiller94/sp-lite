import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import { Head } from '@/components/seo';
import { Spinner } from '@/components/ui/spinner';
import { useRevealLatest } from '@/features/protocol/api';
import type { Protocol } from '@/features/protocol/api/get-protocol';
import {
  REVEAL_STEPS,
  useRevealStepper,
} from '@/features/protocol/components/reveal/reveal-stepper';
import { BiologicalAgeStep } from '@/features/protocol/components/reveal/steps/biological-age-step';
import { BiomarkersStep } from '@/features/protocol/components/reveal/steps/biomarkers-step';
import { GetStartedStep } from '@/features/protocol/components/reveal/steps/get-started-step';
import { GoalStep } from '@/features/protocol/components/reveal/steps/goal-step';
import { HealthScoreStep } from '@/features/protocol/components/reveal/steps/health-score-step';
import { OrderSummaryStep } from '@/features/protocol/components/reveal/steps/order-summary-step';
import { ProductCheckoutStep } from '@/features/protocol/components/reveal/steps/product-checkout-step';
import { RxQuestionnaireStep } from '@/features/protocol/components/reveal/steps/rx-questionnaire-step';
import { ServiceCheckoutStep } from '@/features/protocol/components/reveal/steps/service-checkout-step';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/_app/protocol/reveal/')({
  component: ProtocolRevealIndexComponent,
});

function ProtocolRevealIndexComponent() {
  const step: string | undefined = undefined;
  const navigate = Route.useNavigate();
  const { data: revealData } = useRevealLatest();
  const carePlanId: string | null = revealData?.carePlanId ?? null;
  const { next, previous, initialStep, isLoading, baseSteps, protocol } =
    useRevealStepper(carePlanId ?? undefined, step ?? undefined);

  useEffect(() => {
    if (isLoading || initialStep == null) return;

    if (step == null) {
      void navigate({
        to: '/protocol/reveal/$step',
        params: { step: initialStep },
        replace: true,
      });
      return;
    }

    if (!baseSteps.includes(step)) {
      void navigate({
        to: '/protocol/reveal/$step',
        params: { step: initialStep },
        replace: true,
      });
    }
  }, [step, isLoading, initialStep, baseSteps, navigate]);

  if (isLoading) {
    return (
      <>
        <Head title="Your Health Protocol" />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner variant="primary" />
        </div>
      </>
    );
  }

  if (revealData?.revealCompleted) {
    return <Navigate to="/protocol" replace />;
  }

  if (carePlanId == null || protocol == null) {
    console.error('Missing care plan id or protocol', {
      carePlanId,
      protocol,
    });
    return <Navigate to="/protocol" replace />;
  }

  const currentStepId =
    (step != null && baseSteps.includes(step) ? step : initialStep) ??
    initialStep;

  return (
    <ProtocolRevealContent
      carePlanId={carePlanId}
      protocol={protocol}
      next={next}
      previous={previous}
      currentStepId={currentStepId}
    />
  );
}

interface ProtocolRevealContentProps {
  carePlanId: string;
  protocol: Protocol;
  next: () => void;
  previous: () => void;
  currentStepId: string;
}

const ProtocolRevealContent = ({
  carePlanId,
  protocol,
  next,
  previous,
  currentStepId,
}: ProtocolRevealContentProps) => {
  let stepElement: JSX.Element | null = null;
  switch (currentStepId) {
    case REVEAL_STEPS.GET_STARTED:
      stepElement = <GetStartedStep next={next} />;
      break;
    case REVEAL_STEPS.BIOLOGICAL_AGE:
      stepElement = <BiologicalAgeStep next={next} previous={previous} />;
      break;
    case REVEAL_STEPS.SCORE:
      stepElement = <HealthScoreStep next={next} previous={previous} />;
      break;
    case REVEAL_STEPS.BIOMARKERS:
      stepElement = (
        <BiomarkersStep
          carePlanId={carePlanId}
          next={next}
          previous={previous}
        />
      );
      break;
    case REVEAL_STEPS.ORDER_SUMMARY:
      stepElement = (
        <OrderSummaryStep
          goals={protocol.goals}
          activities={protocol.activities}
          next={next}
          previous={previous}
        />
      );
      break;
    case REVEAL_STEPS.PRODUCT_CHECKOUT:
      stepElement = (
        <ProductCheckoutStep
          carePlanId={carePlanId}
          next={next}
          previous={previous}
        />
      );
      break;
    case REVEAL_STEPS.SERVICE_CHECKOUT:
      stepElement = (
        <ServiceCheckoutStep
          carePlanId={carePlanId}
          next={next}
          previous={previous}
        />
      );
      break;
    case REVEAL_STEPS.RX_QUESTIONNAIRE:
      stepElement = (
        <RxQuestionnaireStep
          carePlanId={carePlanId}
          activities={protocol.activities}
          next={next}
        />
      );
      break;
    default:
      if (currentStepId.startsWith('goal-')) {
        const goalId = currentStepId.replace('goal-', '');

        let goal: Protocol['goals'][number] | undefined = undefined;
        for (const g of protocol.goals) {
          if (g.id === goalId) {
            goal = g;
            break;
          }
        }

        if (goal == null) {
          console.error('Unknown goal step', { currentStepId });
          break;
        }

        const goalActivities: Protocol['activities'] = [];
        for (const activity of protocol.activities) {
          const isGoalActivity =
            (activity.type === 'product' ||
              activity.type === 'service' ||
              activity.type === 'prescription') &&
            activity.goalIds.includes(goal.id);
          if (isGoalActivity) {
            goalActivities.push(activity);
          }
        }

        stepElement = (
          <GoalStep
            goal={goal}
            activities={goalActivities}
            allGoals={protocol.goals}
            next={next}
            previous={previous}
          />
        );
        break;
      }

      console.error('Unknown reveal step', { currentStepId });
      stepElement = null;
  }

  return (
    <>
      <Head title="Your Health Protocol" />
      <div className={cn('')}>{stepElement}</div>
    </>
  );
};
