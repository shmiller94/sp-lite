import { create } from 'zustand';

interface AddOnPanelStoreState {
  selectedPanelIds: Set<string>;
  togglePanel: (panelId: string) => void;
  updateSelectedPanelIds: (panelIds: Set<string>) => void;
  clear: () => void;
}

export const useAddOnPanelStore = create<AddOnPanelStoreState>()((set) => ({
  selectedPanelIds: new Set(),
  togglePanel: (panelId) =>
    set((state) => ({
      selectedPanelIds: state.selectedPanelIds.has(panelId)
        ? new Set(
            Array.from(state.selectedPanelIds).filter((id) => id !== panelId),
          )
        : new Set([...Array.from(state.selectedPanelIds), panelId]),
    })),
  updateSelectedPanelIds: (panelIds: Set<string>) =>
    set({ selectedPanelIds: new Set(panelIds) }),
  clear: () => set(() => ({ selectedPanelIds: new Set() })),
}));
