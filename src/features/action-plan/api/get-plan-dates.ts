import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { PlanDate } from '@/types/api';

export const getPlanDates = (
  page = 1,
): Promise<{
  availableDates: PlanDate[];
}> => {
  return api.get('plans/dates', {
    params: {
      page,
    },
  });
};

export const getPlanDatesQueryOptions = ({ page }: { page?: number } = {}) => {
  return queryOptions({
    queryKey: page ? ['planDates', { page }] : ['planDates'],
    queryFn: () => getPlanDates(page),
  });
};

type usePlanDatesOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getPlanDatesQueryOptions>;
};

export const usePlanDates = ({
  queryConfig,
  page,
}: usePlanDatesOptions = {}) => {
  return useQuery({
    ...getPlanDatesQueryOptions({ page }),
    ...queryConfig,
  });
};
