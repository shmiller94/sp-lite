import { beforeEach, expect, test, vi } from 'vitest';

import { STEP_IDS } from '@/features/onboarding/config/step-config';
import { useOnboardingFlowStore } from '@/features/onboarding/stores/onboarding-flow-store';
import { rtlRender, screen, userEvent } from '@/testing/test-utils';

import { CompletionStep } from '../completion-step';

const navigateMock = vi.fn();

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-router')>(
    '@tanstack/react-router',
  );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

beforeEach(() => {
  navigateMock.mockReset();
  useOnboardingFlowStore.getState().reset();
});

test('navigates home and resets flow state', async () => {
  useOnboardingFlowStore
    .getState()
    .syncFlow([STEP_IDS.INTAKE_SPLASH, STEP_IDS.INTAKE_COMPLETION], 'user-123');
  useOnboardingFlowStore.getState().goTo(STEP_IDS.INTAKE_COMPLETION);

  expect(useOnboardingFlowStore.getState().currentStep).toBe(
    STEP_IDS.INTAKE_COMPLETION,
  );

  rtlRender(<CompletionStep />);

  await userEvent.click(screen.getByRole('button', { name: /continue/i }));

  expect(useOnboardingFlowStore.getState().currentStep).toBeNull();
  expect(useOnboardingFlowStore.getState().isInitialized).toBe(false);
  expect(navigateMock).toHaveBeenCalledWith({ to: '/', replace: true });
});
