import {
  QuestionnaireItem,
  QuestionnaireResponseItem,
} from '@medplum/fhirtypes';

const SCREENING_QUESTIONNAIRE_ELIGIBILITY_EXTENSION_URL =
  'https://superpower.com/fhir/StructureDefinition/screening-questionnaire-eligibility';
const INELIGIBLE_VALUE = 'ineligible';

/**
 * Checks if any of the questionnaire response items (or their descendants)
 * correspond to an "ineligible" answer on the questionnaire definition provided.
 *
 * Traverses both the response and questionnaire trees recursively in one function.
 */
export function isMemberIneligible(
  items: QuestionnaireResponseItem[],
  questions: QuestionnaireItem[],
): boolean | undefined {
  if (!Array.isArray(items) || !Array.isArray(questions)) {
    return undefined;
  }

  // Helper to find matching QuestionnaireItem by linkId, recursing groups if needed.
  function findQuestionByLinkId(
    questionsList: QuestionnaireItem[],
    linkId: string,
  ): QuestionnaireItem | undefined {
    for (const question of questionsList) {
      if (question.linkId === linkId) {
        return question;
      }
      if (question.item) {
        const found = findQuestionByLinkId(question.item, linkId);
        if (found) return found;
      }
    }
    return undefined;
  }

  // The unified recursive function to check ineligibility for a responseItem (and descendants).
  function checkResponseItems(
    responseItems: QuestionnaireResponseItem[],
    questionnaireItems: QuestionnaireItem[],
  ): boolean {
    for (const responseItem of responseItems) {
      const matchingQuestion = findQuestionByLinkId(
        questionnaireItems,
        responseItem.linkId,
      );
      const answerOptions = matchingQuestion?.answerOption;

      // Check current response answers against answerOptions for "ineligible"
      if (Array.isArray(answerOptions)) {
        for (const option of answerOptions) {
          const hasIneligibleExtension = option.extension?.some(
            (ext: { url?: string; valueString?: string }) =>
              ext.url === SCREENING_QUESTIONNAIRE_ELIGIBILITY_EXTENSION_URL &&
              ext.valueString === INELIGIBLE_VALUE,
          );
          const userSelectedOption = responseItem.answer?.some(
            (answer: { valueString?: string }) =>
              answer.valueString === option.valueString,
          );
          if (hasIneligibleExtension && userSelectedOption) {
            return true;
          }
        }
      }

      // Recurse into any nested items, using the nested items for both response and questionnaire
      if (
        Array.isArray(responseItem.item) &&
        Array.isArray(matchingQuestion?.item)
      ) {
        if (checkResponseItems(responseItem.item, matchingQuestion.item)) {
          return true;
        }
      }
    }
    return false;
  }

  return checkResponseItems(items, questions);
}
