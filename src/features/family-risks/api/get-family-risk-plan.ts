import { useQuery } from '@tanstack/react-query';

import { $api } from '@/orpc/client';
import type { operations } from '@/orpc/types.generated';

// Extract family risk plan types from the generated operations
type GetLatestFamilyRiskPlanResponse =
  operations['familyRisk.getLatestFamilyRiskPlan']['responses'][200]['content']['application/json'];

export type FamilyRiskPlan = GetLatestFamilyRiskPlanResponse['plan'];
export type FamilyRisk = FamilyRiskPlan['risks'][number];
export type FamilyRiskCitation = FamilyRisk['citations'][number];
export type BiomarkerReference = FamilyRisk['biomarkers'][number];

/**
 * Hook to fetch the latest family risk plan for the authenticated user
 */
export function useLatestFamilyRiskPlan() {
  return useQuery({
    ...$api.queryOptions('get', '/family-risk/plan'),
    select: (data) => data.plan,
  });
}

/**
 * Hook to fetch a specific family risk plan by ID (public endpoint)
 */
export function useFamilyRiskPlan(planId: string) {
  return useQuery({
    ...$api.queryOptions('get', '/family-risk/plan/{id}', {
      params: {
        path: { id: planId },
      },
    }),
    enabled: !!planId,
    select: (data) => data.plan,
  });
}
