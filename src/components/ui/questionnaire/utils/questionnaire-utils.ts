import {
  TypedValue,
  formatCoding,
  getExtension,
  getTypedPropertyValue,
  stringify,
} from '@medplum/core';
import {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
  QuestionnaireResponseItemAnswer,
} from '@medplum/fhirtypes';

export enum QuestionnaireItemType {
  group = 'group',
  display = 'display',
  question = 'question',
  boolean = 'boolean',
  decimal = 'decimal',
  integer = 'integer',
  date = 'date',
  dateTime = 'dateTime',
  time = 'time',
  string = 'string',
  text = 'text',
  url = 'url',
  choice = 'choice',
  openChoice = 'open-choice',
  attachment = 'attachment',
  reference = 'reference',
  quantity = 'quantity',
}

export function isMultipleChoice(item: QuestionnaireItem): boolean {
  return !!item.extension?.some(
    (e) =>
      e.url ===
        'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl' &&
      e.valueCodeableConcept?.coding?.[0]?.code === 'drop-down',
  );
}

/**
 * This function is used to get the new multi select values from the selected options.
 * It takes the selected options, the property name of the selected options, and the item.
 * It returns an array of objects with the property name and the option value.
 * The property name is the name of the property on the option that contains the value.
 * The option value is the value of the option.
 */
export function getNewMultiSelectValues(
  selected: string[],
  propertyName: string,
  item: QuestionnaireItem,
): QuestionnaireResponseItemAnswer[] {
  return selected.map((o) => {
    const option = item.answerOption?.find(
      (option) =>
        formatCoding(option.valueCoding) === o ||
        option[propertyName as keyof QuestionnaireItemAnswerOption] === o,
    );
    const optionValue = getTypedPropertyValue(
      { type: 'QuestionnaireItemAnswerOption', value: option },
      'value',
    ) as TypedValue;
    return { [propertyName]: optionValue?.value };
  });
}

/**
 * This function is used to format the reference string.
 * It takes a typed value and returns the display or reference.
 */
export function formatReferenceString(typedValue: TypedValue): string {
  return (
    typedValue.value.display ||
    typedValue.value.reference ||
    stringify(typedValue.value)
  );
}

/**
 * Returns the number of pages in the questionnaire.
 *
 * By default, a questionnaire is represented as a simple single page questionnaire,
 * so the default return value is 1.
 *
 * If the questionnaire has a page extension on the first item, then the number of pages
 * is the number of top level items in the questionnaire.
 *
 * @param questionnaire - The questionnaire to get the number of pages for.
 * @returns The number of pages in the questionnaire. Default is 1.
 */
export function getNumberOfPages(questionnaire: Questionnaire): number {
  const firstItem = questionnaire?.item?.[0];
  if (firstItem) {
    const extension = getExtension(
      firstItem,
      'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
    );
    if (extension?.valueCodeableConcept?.coding?.[0]?.code === 'page') {
      return (questionnaire.item as QuestionnaireItem[]).length;
    }
  }
  return 1;
}

function getNumericExtensionValue(extension: any): number | undefined {
  if (!extension) {
    return undefined;
  }
  if (typeof extension.valueDecimal === 'number') {
    return extension.valueDecimal;
  }
  if (typeof extension.valueInteger === 'number') {
    return extension.valueInteger;
  }
  if (typeof extension.valueQuantity?.value === 'number') {
    return extension.valueQuantity.value;
  }
  return undefined;
}

export function getNumericBounds(item: QuestionnaireItem): {
  min?: number;
  max?: number;
} {
  const extensions = item.extension ?? [];

  const minExtension = extensions.find(
    (extension) =>
      extension.url === 'http://hl7.org/fhir/StructureDefinition/minValue',
  );
  const maxExtension = extensions.find(
    (extension) =>
      extension.url === 'http://hl7.org/fhir/StructureDefinition/maxValue',
  );

  const min = getNumericExtensionValue(minExtension);
  const max = getNumericExtensionValue(maxExtension);

  return {
    ...(min !== undefined ? { min } : null),
    ...(max !== undefined ? { max } : null),
  };
}
