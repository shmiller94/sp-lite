import { useMemo } from 'react';

import { FhirCarePlan } from '@/types/api';

import { usePlans } from '../api';

const getTimestamp = (plan: FhirCarePlan) =>
  plan?.period?.start ? new Date(plan.period.start).getTime() : 0;

export const useLatestCompletedPlan = () => {
  const plansQuery = usePlans({});

  const latestPlan: FhirCarePlan | undefined = useMemo(() => {
    const plans = plansQuery.data?.actionPlans ?? [];
    return plans
      .filter((p: FhirCarePlan) => p.status === 'completed')
      .sort((a, b) => getTimestamp(b) - getTimestamp(a))?.[0];
  }, [plansQuery.data?.actionPlans]);

  return { data: latestPlan, isLoading: plansQuery.isLoading };
};
