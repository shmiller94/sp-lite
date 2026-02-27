import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useGetBenefitClaims } from '@/features/b2b/api';
import { useCredits } from '@/features/orders/api/credits';
import { useQuestionnaireResponseList } from '@/features/questionnaires/api/questionnaire-response';
import { useServices } from '@/features/services/api';
import { useUser } from '@/lib/auth';

import { useOnboardingFlowStore } from '../../stores/onboarding-flow-store';
import { useOnboardingFlow } from '../use-onboarding-flow';

vi.mock('@/lib/auth', () => ({
  useUser: vi.fn(),
}));

vi.mock('@/features/questionnaires/api/questionnaire-response', () => ({
  useQuestionnaireResponseList: vi.fn(),
}));

vi.mock('@/features/services/api', () => ({
  useServices: vi.fn(),
}));

vi.mock('@/features/orders/api/credits', () => ({
  useCredits: vi.fn(),
}));

vi.mock('@/features/b2b/api', () => ({
  useGetBenefitClaims: vi.fn(),
}));

const useUserMock = vi.mocked(useUser, { partial: true });
const useQuestionnaireResponseListMock = vi.mocked(
  useQuestionnaireResponseList,
  { partial: true },
);
const useServicesMock = vi.mocked(useServices, { partial: true });
const useCreditsMock = vi.mocked(useCredits, { partial: true });
const useGetBenefitClaimsMock = vi.mocked(useGetBenefitClaims, {
  partial: true,
});

describe('useOnboardingFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useOnboardingFlowStore.getState().reset();

    useUserMock.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    useQuestionnaireResponseListMock.mockImplementation(() => ({
      data: undefined,
      isLoading: false,
    }));

    useServicesMock.mockReturnValue({
      data: {
        services: [],
      },
      isLoading: false,
    });

    useCreditsMock.mockReturnValue({
      data: {
        credits: [],
      },
    });

    useGetBenefitClaimsMock.mockReturnValue({
      data: [],
      isLoading: false,
    });
  });

  it('initializes the store on first render when valid steps are available', () => {
    const { result } = renderHook(() => useOnboardingFlow());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isInitialized).toBe(true);
    expect(useOnboardingFlowStore.getState().isInitialized).toBe(true);
    expect(useQuestionnaireResponseListMock.mock.calls.length).toBeGreaterThan(
      0,
    );
    for (const call of useQuestionnaireResponseListMock.mock.calls) {
      expect(call[0]).toEqual({
        status: 'in-progress,completed,stopped',
        _sort: '-_lastUpdated',
      });
    }
  });
});
