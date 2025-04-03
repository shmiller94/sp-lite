import {
  QuestionnaireItem,
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
} from '@medplum/fhirtypes';

import { QuestionnaireItemType } from './questionnaire-utils';

// Checks through the keys of the answer array for any non-accepted values
const isValueEmpty = (answer: QuestionnaireResponseItemAnswer) => {
  return Object.values(answer).some(
    (v) =>
      v === null ||
      v === undefined ||
      (typeof v === 'number' && isNaN(v)) ||
      v.length === 0,
  );
};

// This function checks if given answers are present - and if not - returns true to e.g. show an error or disable a button
export function isResponseEmpty(
  item: QuestionnaireItem,
  response: QuestionnaireResponseItem,
  checkForQuestionEnabled: (item: QuestionnaireItem) => boolean,
): boolean | undefined {
  const isDisplayType = item.type === QuestionnaireItemType.display;
  const isGroupType = item.type === QuestionnaireItemType.group;

  if (isDisplayType) {
    return false;
  }

  if (!isGroupType) {
    if (!response.answer || response.answer.length === 0) {
      return true;
    }

    if (
      item.type !== QuestionnaireItemType.choice &&
      item.type !== QuestionnaireItemType.openChoice
    ) {
      return response.answer.some(isValueEmpty);
    }
  }

  return item.item?.some((nestedItem) => {
    const isRequired =
      nestedItem.required && checkForQuestionEnabled(nestedItem);
    const hasAnswer = response.item?.find(
      (r) => r.linkId === nestedItem.linkId,
    )?.answer;

    if (!hasAnswer || hasAnswer.length === 0) {
      return isRequired;
    }

    const hasEmptyValues = hasAnswer.some(isValueEmpty);

    return isRequired && hasEmptyValues;
  });
}

// Ensures that the response item has a nested item for each item in the group
export function ensureNestedResponseItems(
  item: QuestionnaireItem,
  response: QuestionnaireResponseItem,
  onChange: (response: QuestionnaireResponseItem[]) => void,
) {
  if (item.type === QuestionnaireItemType.group && item.item) {
    if (!response.item) {
      response.item = [];
    }

    item.item.forEach((nestedItem) => {
      const existingResponse = response.item?.find(
        (respItem) => respItem.linkId === nestedItem.linkId,
      );

      if (!existingResponse) {
        const newNestedItem: QuestionnaireResponseItem = {
          linkId: nestedItem.linkId,
          text: nestedItem.text,
        };

        response.item?.push(newNestedItem);
      }
    });

    onChange([response]);
  }
}

// Finds a nested response item by its linkId
function findNestedResponseItem(
  linkId: string,
  items: QuestionnaireResponseItem[] = [],
): QuestionnaireResponseItem | undefined {
  for (const item of items) {
    if (item.linkId === linkId) {
      return item;
    }
    if (item.item) {
      const found = findNestedResponseItem(linkId, item.item);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

// Ensures that required fields are validated
export function validateRequiredFields(
  item: QuestionnaireItem,
  response: QuestionnaireResponseItem,
  checkForQuestionEnabled: (item: QuestionnaireItem) => boolean,
): string[] | false {
  if (item.type !== QuestionnaireItemType.group) {
    return false;
  }

  const requiredItems =
    item.item?.filter(
      (nestedItem) =>
        nestedItem.required && checkForQuestionEnabled(nestedItem),
    ) || [];

  if (requiredItems.length === 0) {
    return false;
  }

  const missingFields: string[] = [];

  requiredItems.forEach((nestedItem) => {
    let nestedResponse = response.item?.find(
      (respItem) => respItem.linkId === nestedItem.linkId,
    );

    if (!nestedResponse) {
      nestedResponse = findNestedResponseItem(nestedItem.linkId, response.item);
    }

    if (
      !nestedResponse ||
      !nestedResponse.answer ||
      nestedResponse.answer.length === 0
    ) {
      missingFields.push(nestedItem.linkId);
    }
  });

  if (missingFields.length > 0) {
    return missingFields;
  }

  return false;
}
