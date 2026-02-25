import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { STEP_IDS } from '@/features/onboarding/config/step-config';
import { useOnboardingFlowStore } from '@/features/onboarding/stores/onboarding-flow-store';
import { useQuestionnaireResponseList } from '@/features/questionnaires/api/questionnaire-response';
import { useUser } from '@/lib/auth';

import { useIntakeFlow } from '../use-intake-flow';

vi.mock('@/lib/auth', () => ({
  useUser: vi.fn(),
}));

vi.mock('@/features/questionnaires/api/questionnaire-response', () => ({
  useQuestionnaireResponseList: vi.fn(),
}));

const useUserMock = vi.mocked(useUser, { partial: true });
const useQuestionnaireResponseListMock = vi.mocked(
  useQuestionnaireResponseList,
  { partial: true },
);

describe('useIntakeFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useOnboardingFlowStore.getState().reset();

    useUserMock.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    useQuestionnaireResponseListMock.mockReturnValue({
      data: undefined,
      isLoading: false,
    });
  });

  it('initializes the store on first render when valid steps are available', () => {
    const { result } = renderHook(() => useIntakeFlow());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isInitialized).toBe(true);
    expect(useOnboardingFlowStore.getState().isInitialized).toBe(true);
    expect(useOnboardingFlowStore.getState().currentStep).toBe(
      STEP_IDS.INTAKE_SPLASH,
    );
  });
});
