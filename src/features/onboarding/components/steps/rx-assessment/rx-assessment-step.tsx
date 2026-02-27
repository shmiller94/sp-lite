import { Spinner } from '@/components/ui/spinner';
import { useQuestionnaireResponseList } from '@/features/questionnaires/api/questionnaire-response';
import { RxQuestionnaire } from '@/features/questionnaires/components/rx-questionnaire';

import { useOnboardingNavigation } from '../../../hooks/use-onboarding-navigation';
import { getRxQuestionnaireContext } from '../../../utils/get-rx-questionnaire-context';

const LoadingState = ({ label }: { label?: string }) => {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-3">
      <Spinner variant="primary" size="md" />
      {label == null ? null : (
        <p className="text-sm text-zinc-500" role="status">
          {label}
        </p>
      )}
    </div>
  );
};

export const RxAssessmentStep = () => {
  const { next } = useOnboardingNavigation();

  const { data: questionnaireResponses, isLoading } =
    useQuestionnaireResponseList({
      status: 'in-progress,completed,stopped',
      _sort: '-_lastUpdated',
    });

  if (isLoading) {
    return <LoadingState />;
  }

  const rxQuestionnaireContext = getRxQuestionnaireContext(
    questionnaireResponses,
  );

  if (rxQuestionnaireContext.status !== 'required') {
    return <LoadingState label="Preparing your next step..." />;
  }

  return (
    <RxQuestionnaire
      name={rxQuestionnaireContext.questionnaireName}
      onSubmit={next}
    />
  );
};
