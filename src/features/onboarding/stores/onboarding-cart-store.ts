import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingCartStoreState {
  selectedPanelIds: Set<string>;
  togglePanel: (panelId: string) => void;
  addPanel: (panelId: string) => void;
  clear: () => void;
}

interface OnboardingCartPersistedState {
  selectedPanelIds: string[];
}

export const useOnboardingCartStore = create<OnboardingCartStoreState>()(
  persist(
    (set) => ({
      selectedPanelIds: new Set<string>(),
      togglePanel: (panelId) =>
        set((state) => {
          const nextIds = new Set(state.selectedPanelIds);
          if (nextIds.has(panelId)) {
            nextIds.delete(panelId);
          } else {
            nextIds.add(panelId);
          }
          return { selectedPanelIds: nextIds };
        }),
      addPanel: (panelId) =>
        set((state) => {
          if (state.selectedPanelIds.has(panelId)) {
            return state;
          }
          const nextIds = new Set(state.selectedPanelIds);
          nextIds.add(panelId);
          return { selectedPanelIds: nextIds };
        }),
      clear: () => set(() => ({ selectedPanelIds: new Set<string>() })),
    }),
    {
      name: 'onboarding-cart-store',
      partialize: (state): OnboardingCartPersistedState => ({
        selectedPanelIds: Array.from(state.selectedPanelIds),
      }),
      merge: (persistedState, currentState) => {
        const selectedPanelIds: string[] = [];
        if (
          typeof persistedState === 'object' &&
          persistedState !== null &&
          'selectedPanelIds' in persistedState
        ) {
          const maybeSelectedPanelIds = persistedState.selectedPanelIds;
          if (Array.isArray(maybeSelectedPanelIds)) {
            for (const panelId of maybeSelectedPanelIds) {
              if (typeof panelId === 'string') {
                selectedPanelIds.push(panelId);
              }
            }
          }
        }

        return {
          ...currentState,
          selectedPanelIds: new Set(selectedPanelIds),
        };
      },
    },
  ),
);
