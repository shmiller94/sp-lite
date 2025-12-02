import { QuestionnaireResponse } from '@medplum/fhirtypes';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { QuestionnaireName } from '@/types/api';

export const getQuestionnaireResponse = ({
  identifier,
  statuses,
}: {
  identifier: string | QuestionnaireName; // id, or most recent questionnaire response by identifier or name
  statuses?: (
    | 'completed'
    | 'in-progress'
    | 'stopped'
    | 'entered-in-error'
    | 'amended'
  )[];
}): Promise<{
  questionnaireResponse: QuestionnaireResponse | null;
}> => {
  return api.get(`/questionnaire-response/${identifier}`, {
    params: { statusQuery: statuses?.join(',') },
  });
};

export const getQuestionnaireResponseQueryOptions = (
  identifier: string | QuestionnaireName, // id, or most recent questionnaire response by identifier or name
  statuses?: (
    | 'completed'
    | 'in-progress'
    | 'stopped'
    | 'entered-in-error'
    | 'amended'
  )[],
) => {
  return queryOptions({
    queryKey: ['questionnaire-response', identifier],
    queryFn: () =>
      getQuestionnaireResponse({
        identifier: identifier as string | QuestionnaireName,
        statuses,
      }),
  });
};

type UseQuestionnaireResponseOptions = {
  identifier: string | QuestionnaireName; // id, or most recent questionnaire response by identifier or name
  statuses?: (
    | 'completed'
    | 'in-progress'
    | 'stopped'
    | 'entered-in-error'
    | 'amended'
  )[];
  queryConfig?: QueryConfig<typeof getQuestionnaireResponseQueryOptions>;
};

export const useQuestionnaireResponse = ({
  identifier,
  statuses,
  queryConfig,
}: UseQuestionnaireResponseOptions) => {
  return useQuery({
    ...getQuestionnaireResponseQueryOptions(identifier, statuses),
    ...queryConfig,
  });
};
