import { useMemo } from 'react';

import {
  STEP_IDS,
  type StepId,
} from '@/features/onboarding/config/step-config';
import { useSyncFlowStore } from '@/features/onboarding/hooks/use-sync-flow-store';
import { useOnboardingFlowStore } from '@/features/onboarding/stores/onboarding-flow-store';
import {
  buildQuestionnaireStatusMap,
  getQuestionnaireStatus,
} from '@/features/onboarding/utils/get-questionnaire-status';
import { useQuestionnaireResponseList } from '@/features/questionnaires/api/questionnaire-response';
import { useUser } from '@/lib/auth';

const QUESTIONNAIRE_NAMES = [
  'onboarding-primer',
  'onboarding-medical-history',
  'onboarding-female-health',
  'onboarding-lifestyle',
] as const;

type IntakeContext = {
  primerDone: boolean;
  medHistoryDone: boolean;
  femaleHealthDone: boolean;
  lifestyleDone: boolean;
  gender: 'male' | 'female' | null;
};

/** Splash -> incomplete questionnaires -> completion */
const getIntakeSteps = (ctx: IntakeContext): StepId[] => {
  const steps: StepId[] = [STEP_IDS.INTAKE_SPLASH];

  if (!ctx.primerDone) steps.push(STEP_IDS.PRIMER);
  if (!ctx.medHistoryDone) steps.push(STEP_IDS.MEDICAL_HISTORY);
  if (!ctx.femaleHealthDone && ctx.gender === 'female')
    steps.push(STEP_IDS.FEMALE_HEALTH);
  if (!ctx.lifestyleDone) steps.push(STEP_IDS.LIFESTYLE);

  steps.push(STEP_IDS.INTAKE_COMPLETION);
  return steps;
};

/** Fetches user + questionnaire data and initializes the flow store. */
export const useIntakeFlow = () => {
  const isInitialized = useOnboardingFlowStore((state) => state.isInitialized);
  const { data: user, isLoading: userLoading } = useUser();
  const { data: responses, isLoading: questionnairesLoading } =
    useQuestionnaireResponseList({
      questionnaireName: QUESTIONNAIRE_NAMES.join(','),
      status: 'in-progress,completed,stopped',
    });

  const isLoading = userLoading || questionnairesLoading;

  const ctx = useMemo((): IntakeContext | null => {
    if (isLoading) return null;

    const statusMap = buildQuestionnaireStatusMap(responses);
    const done = (name: string) =>
      getQuestionnaireStatus(statusMap, name) === 'completed';

    const g = user?.gender?.toLowerCase();

    return {
      primerDone: done('onboarding-primer'),
      medHistoryDone: done('onboarding-medical-history'),
      femaleHealthDone: done('onboarding-female-health'),
      lifestyleDone: done('onboarding-lifestyle'),
      gender: g === 'male' ? 'male' : g === 'female' ? 'female' : null,
    };
  }, [isLoading, user, responses]);

  const userId = user?.id ?? '';

  const validSteps = useMemo(() => (ctx ? getIntakeSteps(ctx) : null), [ctx]);

  // Uses the same reconciliation path as onboarding to keep behavior consistent.
  useSyncFlowStore({ validSteps, userId });

  return { isLoading, isInitialized };
};
