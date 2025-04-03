import { deepEquals, getTypedPropertyValue } from '@medplum/core';
import {
  QuestionnaireItem,
  QuestionnaireResponseItem,
} from '@medplum/fhirtypes';

import { AnimatedCheckbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { QuestionnaireErrorWrapper } from '../questionnaire-error-wrapper';
import { useQuestionnaireStore } from '../stores/questionnaire-store';

interface MultipleChoiceProps {
  item: QuestionnaireItem;
  response: QuestionnaireResponseItem;
  isError: boolean;
  onChange: (newResponseItem: QuestionnaireResponseItem) => void;
}

export function MultipleChoice({
  item,
  response,
  isError,
  onChange,
}: MultipleChoiceProps) {
  const options = item.answerOption || [];
  const gridCols = options.length > 5 ? 'md:grid-cols-2' : 'grid-cols-1';

  const nextStep = useQuestionnaireStore((s) => s.nextStep);
  const activeStep = useQuestionnaireStore((s) => s.activeStep);
  const questionnaire = useQuestionnaireStore((s) => s.questionnaire);
  const getNumberOfPages = useQuestionnaireStore((s) => s.getNumberOfPages);
  const isLastQuestion = activeStep === getNumberOfPages() - 1;

  const autoAdvance = () => {
    const currentPage = questionnaire.item?.[activeStep];

    // Case 1: Check if this is the only question in a group
    const isSingleQuestionInGroup =
      currentPage?.type === 'group' && currentPage.item?.length === 1;

    // Case 2: Check if this is a direct question (not in a group)
    const isDirectQuestion = currentPage?.type !== 'group';

    if (!isLastQuestion && (isSingleQuestionInGroup || isDirectQuestion)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        nextStep();
      }, 500);
    }
  };

  return (
    <QuestionnaireErrorWrapper
      isError={isError}
      message="You have to select at least one option."
    >
      <div className="space-y-2">
        <div className={`grid ${gridCols} gap-2`}>
          {options.map((option, idx) => {
            const optionValue =
              option.valueString || option.valueCoding?.display || '';
            return (
              <div
                role="button"
                data-item-id={item.linkId}
                tabIndex={0}
                key={idx}
                className={cn(
                  'relative flex w-full cursor-pointer group items-center justify-between space-x-2 rounded-xl bg-white transition-all outline-none ring-0 focus-visible:ring-2 focus-visible:ring-secondary',
                  response.answer?.some((answer) => {
                    const answerValue = getItemValue(answer);
                    return deepEquals(answerValue.value, optionValue);
                  })
                    ? 'bg-black text-white hover:bg-zinc-800'
                    : 'hover:bg-zinc-50',
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();

                    const currentAnswers = response.answer || [];
                    const alreadySelected = currentAnswers.some((answer) => {
                      const answerValue = getItemValue(answer);
                      return deepEquals(answerValue.value, optionValue);
                    });

                    const newAnswers = alreadySelected
                      ? currentAnswers.filter((answer) => {
                          const answerValue = getItemValue(answer);
                          return !deepEquals(answerValue.value, optionValue);
                        })
                      : [...currentAnswers, { valueString: optionValue }];

                    onChange({ ...response, answer: newAnswers });

                    if (newAnswers.length === 1 && !item.repeats) {
                      autoAdvance();
                    }
                  }
                }}
              >
                <Label
                  htmlFor={`${item.linkId}-${idx}`}
                  className="flex-1 cursor-pointer p-5 pr-16 text-base"
                >
                  {optionValue}
                </Label>
                <AnimatedCheckbox
                  tabIndex={-1}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white transition-all"
                  id={`${item.linkId}-${idx}`}
                  checked={response.answer?.some((answer) => {
                    const answerValue = getItemValue(answer);
                    return deepEquals(answerValue.value, optionValue);
                  })}
                  onCheckedChange={(checked) => {
                    const currentAnswers = response.answer || [];
                    const newAnswers = checked
                      ? [...currentAnswers, { valueString: optionValue }]
                      : currentAnswers.filter((answer) => {
                          const answerValue = getItemValue(answer);
                          return !deepEquals(answerValue.value, optionValue);
                        });
                    onChange({ ...response, answer: newAnswers });

                    // Only auto-advance if this is a single answer (checkbox used as radio)
                    if (checked && !item.repeats) {
                      autoAdvance();
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </QuestionnaireErrorWrapper>
  );
}

function getItemValue(answer: any): any {
  return getTypedPropertyValue(
    { type: 'QuestionnaireItemAnswer', value: answer },
    'value',
  );
}
