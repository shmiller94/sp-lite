import { QuestionnaireForm } from '@/components/ui/questionnaire';
import { Spinner } from '@/components/ui/spinner';
import { useQuestionnaire } from '@/features/questionnaires/api/get-questionnaire';
import { useQuestionnaireResponse } from '@/features/questionnaires/api/get-questionnaire-response';
import { useUpdateQuestionnaireResponse } from '@/features/questionnaires/api/update-questionnaire-response';
import { QuestionnaireName } from '@/types/api';

export const IntakeQuestionnaire = ({
  showIntro = true,
  onSubmit,
}: {
  showIntro: boolean;
  onSubmit?: () => void;
}) => {
  const updateQuestionnaireResponseMutation = useUpdateQuestionnaireResponse();

  const getQuestionnaireQuery = useQuestionnaire({
    questionnaireName: 'onboarding-intake',
  });

  const getQuestionnaireResponseQuery = useQuestionnaireResponse({
    questionnaireName: 'onboarding-intake',
  });

  if (
    getQuestionnaireQuery.isLoading ||
    getQuestionnaireResponseQuery.isLoading
  ) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Spinner variant="primary" size="md" />
      </div>
    );
  }

  if (
    !getQuestionnaireQuery.data ||
    !getQuestionnaireResponseQuery.data ||
    getQuestionnaireResponseQuery.data.questionnaireResponse === null
  ) {
    return null;
  }

  return (
    <QuestionnaireForm
      questionnaire={getQuestionnaireQuery.data.questionnaire}
      response={getQuestionnaireResponseQuery.data.questionnaireResponse}
      onSave={(item) => {
        updateQuestionnaireResponseMutation.mutate({
          data: { item, status: 'in-progress' },
          questionnaireName: 'onboarding-intake' as QuestionnaireName,
        });
      }}
      onSubmit={(item) => {
        updateQuestionnaireResponseMutation.mutate({
          data: { item, status: 'completed' },
          questionnaireName: 'onboarding-intake' as QuestionnaireName,
        });
        onSubmit && onSubmit();
      }}
      showIntro={showIntro}
      className="space-y-6"
    />
  );
};
