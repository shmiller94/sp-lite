import { ReactNode } from 'react';
import { createStore } from 'zustand';

export type StepItem = {
  id: string;
  content: ReactNode;
};

export interface StepperProps {
  steps: StepItem[];
}

export interface StepperStore extends StepperProps {
  activeStep: number;
  nextStep: () => void;
  prevStep: () => void;
  insertStepsAfter: (id: string, newSteps: StepItem[]) => void;
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

  return createStore<StepperStore>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    activeStep: 0,
    nextStep: () => set((state) => ({ activeStep: state.activeStep + 1 })),
    prevStep: () => set((state) => ({ activeStep: state.activeStep - 1 })),
    insertStepsAfter: (id: string, newSteps: StepItem[]) =>
      set((state) => {
        const index = state.steps.findIndex((step) => step.id === id);

        // Handle case where stepId is not found
        if (index === -1) {
          console.warn(`Step with ID ${id} not found.`);
          return state; // Return the state unchanged
        }

        // Handle case where newSteps is empty (optional)
        if (newSteps.length === 0) {
          console.warn(`No steps provided for insertion after step ID ${id}.`);
          return state; // Return the state unchanged
        }

        // Proceed with inserting the new steps
        const updatedSteps = [
          ...state.steps.slice(0, index + 1),
          ...newSteps,
          ...state.steps.slice(index + 1),
        ];

        return { steps: updatedSteps };
      }),
  }));
};
