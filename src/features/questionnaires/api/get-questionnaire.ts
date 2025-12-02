import { Questionnaire } from '@medplum/fhirtypes';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { QuestionnaireName } from '@/types/api';

export const getQuestionnaire = ({
  identifier,
}: {
  // could be name of Questionnaire, or 'Questionnaire/{id}'
  identifier: string | QuestionnaireName;
}): Promise<{
  questionnaire: Questionnaire;
}> => {
  return api.get(`/questionnaires/${identifier}`);
};

export const getQuestionnaireQueryOptions = (
  identifier: string | QuestionnaireName,
) => {
  return queryOptions({
    queryKey: ['questionnaire', identifier],
    queryFn: () => getQuestionnaire({ identifier }),
  });
};

type UseQuestionnaireOptions = {
  identifier: string | QuestionnaireName;
  queryConfig?: QueryConfig<typeof getQuestionnaireQueryOptions>;
};

export const useQuestionnaire = ({
  identifier,
  queryConfig,
}: UseQuestionnaireOptions) => {
  return useQuery({
    ...getQuestionnaireQueryOptions(identifier),
    ...queryConfig,
  });
};
