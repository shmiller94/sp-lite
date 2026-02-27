import { NON_SYMPTOM_RX_VALUE_RE } from '@/const/questionnaire';
import { type ListQuestionnaireResponsesResponse } from '@/features/questionnaires/api/questionnaire-response';

/**
 * Derives whether the member has an Rx intake questionnaire to complete.
 *
 * We treat any QuestionnaireResponse whose `identifier.value` matches
 * `NON_SYMPTOM_RX_VALUE_RE` as an Rx intake questionnaire response (excluding
 * symptom trackers).
 *
 * Note: Callers should pass responses sorted by `-_lastUpdated` so the most
 * recently updated matching response wins.
 */
export const getRxQuestionnaireContext = (
  questionnaireResponses: ListQuestionnaireResponsesResponse | undefined,
) => {
  for (const response of questionnaireResponses ?? []) {
    const questionnaireName = response.identifier?.value;
    if (questionnaireName == null) {
      continue;
    }
    if (!NON_SYMPTOM_RX_VALUE_RE.test(questionnaireName)) {
      continue;
    }

    if (response.status === 'in-progress' || response.status === 'stopped') {
      return {
        status: 'required',
        questionnaireName,
      } as const;
    }

    if (response.status === 'completed') {
      return {
        status: 'completed',
      } as const;
    }
  }

  return {
    status: 'none',
  } as const;
};

/**
 * Discriminated union describing whether an Rx intake questionnaire is required.
 *
 * - `none`: no matching Rx intake QuestionnaireResponse exists
 * - `required`: an in-progress/stopped Rx intake response exists and should be resumed
 * - `completed`: the most recent matching Rx intake response is completed
 */
export type RxQuestionnaireContext = ReturnType<
  typeof getRxQuestionnaireContext
>;
