import { useCredits } from '../api/credits/get-credits';

interface UseHasCreditProps {
  serviceName: string;
}

/**
 *
 * @param serviceName - Name of the service
 * @returns
 */
export const useHasCredit = ({ serviceName }: UseHasCreditProps) => {
  const creditsQuery = useCredits({});

  const draftCredits = creditsQuery.data?.credits ?? [];

  const existingCredit = draftCredits?.find(
    (o) => o.serviceName === serviceName,
  );

  return {
    isCreditLoading: creditsQuery.isLoading,
    credit: existingCredit,
    hasCredit: !!existingCredit,
  };
};
