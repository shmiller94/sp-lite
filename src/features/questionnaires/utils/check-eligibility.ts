import {
  QuestionnaireItem,
  QuestionnaireResponseItem,
} from '@medplum/fhirtypes';

const FHIR_ELIGIBILITY_EXTENSION_URL =
  'https://superpower.com/fhir/StructureDefinition/screening-questionnaire-eligibility';

export function checkEligibility(
  answers?: QuestionnaireResponseItem[],
  questions?: QuestionnaireItem[],
): boolean | undefined {
  let isIneligible = false;

  if (!answers || !questions) return;

  const eligibilityGroupResponse = answers.find(
    (item) => item.linkId === 'eligibility-group',
  );
  if (
    !eligibilityGroupResponse ||
    !eligibilityGroupResponse.item ||
    eligibilityGroupResponse.item.length === 0
  ) {
    return;
  }

  const eligibilityGroupQuestionnaire = questions.find(
    (item) => item.linkId === 'eligibility-group',
  );
  if (
    !eligibilityGroupQuestionnaire ||
    !eligibilityGroupQuestionnaire.item ||
    eligibilityGroupQuestionnaire.item.length === 0
  ) {
    return;
  }

  eligibilityGroupResponse.item.forEach((item) => {
    const matchingQuestion = eligibilityGroupQuestionnaire.item?.find(
      (q) => q.linkId === item.linkId,
    );
    if (matchingQuestion && matchingQuestion.answerOption) {
      matchingQuestion.answerOption.forEach((option) => {
        const hasIneligibleExtension = option.extension?.some(
          (ext) =>
            ext.url === FHIR_ELIGIBILITY_EXTENSION_URL &&
            ext.valueString === 'ineligible',
        );

        const userSelectedOption = item.answer?.some(
          (ans) => ans.valueString === option.valueString,
        );

        if (hasIneligibleExtension && userSelectedOption) {
          isIneligible = true;
        }
      });
    }
  });

  return isIneligible;
}
