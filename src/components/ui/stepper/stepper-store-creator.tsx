import { ReactNode } from 'react';
import { createStore } from 'zustand';

import { api } from '@/lib/api-client';

export type StepItem = {
  id: string;
  content: ReactNode;
};

export interface StepperProps {
  steps: StepItem[];
  initialStep?: number;
}

export interface StepperStore extends StepperProps {
  activeStep: number;
  nextStep: () => void;
  prevStep: () => void;
  resetSteps: () => void;

  /* We are exposing nextOnboardingStep only because server only allows to update if new value is greater than old one */
  nextOnboardingStep: () => Promise<void>;
  /* Updating step is a loading state for step update call */
  updatingStep: boolean;
}

export type StepperStoreApi = ReturnType<typeof stepperStoreCreator>;

export const stepperStoreCreator = (initProps?: Partial<StepperStore>) => {
  const DEFAULT_PROPS: StepperProps = {
    steps: [],
  };

  // additional check to make sure all steps are unique
  if (initProps?.steps) {
    const ids = initProps.steps.map((step) => step.id);
    const uniqueIds = new Set(ids);

    if (ids.length !== uniqueIds.size) {
      throw new Error('Step IDs must be unique');
    }
  }

  return createStore<StepperStore>()((set, get) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    activeStep: initProps?.initialStep ?? 0,
    nextStep: () => set((state) => ({ activeStep: state.activeStep + 1 })),
    prevStep: () => set((state) => ({ activeStep: state.activeStep - 1 })),
    updatingStep: false,
    nextOnboardingStep: async () => {
      set({ updatingStep: true });
      const state = get();
      const activeStep = state.activeStep;
      await api.put<boolean>(`users/onboarding`, {
        progress: activeStep + 1,
      });
      set((state) => ({
        updatingStep: false,
        activeStep: state.activeStep + 1,
      }));
    },
    resetSteps: () => set(() => ({ activeStep: 0 })),
  }));
};
