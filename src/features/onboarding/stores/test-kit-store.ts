import { create } from 'zustand';

interface TestKitStoreState {
  selectedServiceIds: string[];
  toggleService: (serviceId: string) => void;
  clear: () => void;
}

export const useTestKitStore = create<TestKitStoreState>()((set) => ({
  selectedServiceIds: [],
  toggleService: (serviceId) =>
    set((state) => ({
      selectedServiceIds: state.selectedServiceIds.includes(serviceId)
        ? state.selectedServiceIds.filter((id) => id !== serviceId)
        : [...state.selectedServiceIds, serviceId],
    })),
  clear: () => set(() => ({ selectedServiceIds: [] })),
}));
