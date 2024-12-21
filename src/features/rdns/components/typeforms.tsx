import moment from 'moment-timezone';
import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { H3, H4, Body1, Body2 } from '@/components/ui/typography';
import { useCurrentPatient } from '@/features/rdns/hooks/use-current-patient';
import { getTypeformAnswerText } from '@/features/rdns/utils/get-typeform-answer-text';
import { sortTypeformAnswers } from '@/features/rdns/utils/sort-typeform-answers';
import { TypeformWebhook } from '@/types/api';

const QAItem = ({
  question,
  answer,
  description,
}: {
  question: string;
  answer: string;
  description?: string;
}) => (
  <div className="space-y-4 border-b border-zinc-200 py-6">
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <H4>Q:</H4>
        <p className="text-zinc-700">{question}</p>
      </div>
      {description && (
        <Body2 className="italic text-zinc-400">{description}</Body2>
      )}
    </div>
    <div className="flex items-center gap-2">
      <H4>A:</H4>
      <Body1>{answer}</Body1>
    </div>
  </div>
);

export const TypeformAnswers = () => {
  const { selectedPatient: patient, typeforms } = useCurrentPatient();
  const [typeform, setTypeform] = useState<TypeformWebhook | undefined>(
    typeforms && typeforms.length > 0 ? typeforms[0] : undefined,
  );

  if (!patient) {
    return (
      <Body1 className="p-4">No patient selected. Most likely a bug.</Body1>
    );
  }

  if (!typeform) {
    return <Body1 className="p-4">No Typeform responses available.</Body1>;
  }

  const { formResponse } = typeform;

  formResponse.answers = sortTypeformAnswers(formResponse.answers);

  return (
    <div className="h-[664px] space-y-6 overflow-auto scrollbar scrollbar-track-zinc-50 scrollbar-thumb-zinc-600">
      <div className="flex items-center justify-between">
        <H4>Typeforms</H4>
        <Select
          value={typeform.formId}
          onValueChange={(value) =>
            setTypeform(typeforms?.find((t) => t.formId === value))
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Form" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {!typeforms?.length ? (
                <SelectLabel>No typeforms found!</SelectLabel>
              ) : null}
              {typeforms?.map((form) => (
                <SelectItem key={form.formId} value={form.formId}>
                  {form.formResponse.definition.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4 rounded-lg border bg-zinc-100 p-4">
        <H3 className="text-center">{formResponse.definition.title}</H3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Body1>Patient Name:</Body1>
            <Body1>
              {patient.firstName} {patient.lastName} ({patient.gender.charAt(0)}
              )
            </Body1>
          </div>
          <div className="flex items-center gap-2">
            <Body1>Patient DOB:</Body1>
            <Body1>
              {moment(patient.dateOfBirth).format('MMMM D, YYYY')}{' '}
              <span className="text-zinc-600">
                (Age: {moment().diff(patient?.dateOfBirth, 'years')})
              </span>
            </Body1>
          </div>
          <div className="flex items-center gap-2">
            <Body1>Patient Email:</Body1>
            <Body1>{patient.email}</Body1>
          </div>
          <div className="flex items-center gap-2">
            <Body1>Patient ID:</Body1>
            <Body1>{patient.id}</Body1>
          </div>
          <div className="flex items-center gap-2">
            <Body1>Calculated Score:</Body1>
            <Body1>{formResponse.calculated?.score ?? 'N/A'}</Body1>
          </div>
        </div>
      </div>

      <div>
        <H4>Answers:</H4>
        <Separator />
        {formResponse.answers.map((answer, index) => {
          const field = formResponse.definition.fields.find(
            (field) =>
              field.id === answer.field.id || field.ref === answer.field.ref,
          );

          if (!field) return null;

          const answerText = getTypeformAnswerText(answer);

          return (
            <QAItem
              key={index}
              question={field.title}
              answer={answerText}
              description={answer.description}
            />
          );
        })}
      </div>
    </div>
  );
};
