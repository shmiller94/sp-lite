import { useEffect } from 'react';

import { type StepId } from '../config/step-config';
import { useOnboardingFlowStore } from '../stores/onboarding-flow-store';

interface UseSyncFlowStoreArgs {
  validSteps: StepId[] | null;
  userId: string;
}

/**
 * Synchronizes computed step lists into the shared flow store.
 *
 * This is intentionally effect-based (instead of render-time store writes) to
 * avoid render-loop pitfalls and keep synchronization behavior consistent
 * across onboarding/intake hooks.
 */
export const useSyncFlowStore = ({
  validSteps,
  userId,
}: UseSyncFlowStoreArgs) => {
  const syncFlow = useOnboardingFlowStore((state) => state.syncFlow);

  useEffect(() => {
    // Wait until caller has enough data to produce a concrete step list.
    if (validSteps === null) return;
    syncFlow(validSteps, userId);
  }, [validSteps, userId, syncFlow]);
};
