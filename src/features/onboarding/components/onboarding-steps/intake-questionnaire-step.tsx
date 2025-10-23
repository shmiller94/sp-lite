import { IntakeQuestionnaire } from '@/features/questionnaires/components/intake-questionnaire';

import { useOnboardingStepper } from './onboarding-stepper';

interface QuestionnaireStepProps {
  showIntro?: boolean;
}

export const IntakeQuestionnaireStep = ({
  showIntro = true,
}: QuestionnaireStepProps) => {
  const { next } = useOnboardingStepper();

  return <IntakeQuestionnaire showIntro={showIntro} onSubmit={next} />;
};
