import { create } from 'zustand';

import { AddressInput } from '@/shared/api/update-profile';
import { HealthcareService, Slot } from '@/types/api';

export type MembershipType = 'DEFAULT';
export type BloodPackageType = 'BASELINE' | 'ADVANCED';
export type CollectionMethodType = 'AT_HOME' | 'IN_LAB';
export type ScheduledSlots = {
  blood: Slot | null;
  cancer: Slot | null;
  microbiome: AddressInput | null;
  toxin: AddressInput | null;
};

type OnboardingStore = {
  /* TODO: remove that when we connect real server */
  address: AddressInput | null;
  updateAddress: (address: AddressInput) => void;
  isBlocked: boolean /* Primarly used after address step if zip code not supported */;
  updateBlocked: (
    status: boolean,
  ) => void /* Primarly used after address step if zip code not supported */;

  membership: MembershipType | null;
  updateMembership: (membership: MembershipType) => void;
  bloodPackage: BloodPackageType | null;
  updateBloodPackage: (bloodPackage: BloodPackageType) => void;
  collectionMethod: CollectionMethodType | null;
  updateCollectionMethod: (collectionMethod: CollectionMethodType) => void;

  /* Used to keep track of all additional services user orders in configurator */
  additionalServices: HealthcareService[];
  addAdditionalService: (additionalService: HealthcareService) => void;
  removeAdditionalService: (id: string) => void;

  /* Used to keep track of all slots/addresses user selected for services */
  slots: ScheduledSlots;
  updateBloodSlot: (slot: Slot | null) => void;
  updateCancerSlot: (slot: Slot | null) => void;
  updateMicrobiomeAddress: (address: AddressInput) => void;
  updateToxinAddress: (address: AddressInput) => void;

  /* Used to keep track of current total order accross steps */
  orderTotal: number;
  increaseOrderTotal: (amount: number) => void;
  decreaseOrderTotal: (amount: number) => void;
};

export const useOnboarding = create<OnboardingStore>((set) => ({
  address: null,
  updateAddress: (address: AddressInput) =>
    set((state) => ({ ...state, address: address })),
  isBlocked: false,
  updateBlocked: (status) => set({ isBlocked: status }),
  membership: 'DEFAULT',
  updateMembership: (membership) => set({ membership: membership }),
  bloodPackage: 'BASELINE',
  updateBloodPackage: (bloodPackage) => set({ bloodPackage: bloodPackage }),
  collectionMethod: 'IN_LAB',
  updateCollectionMethod: (collectionMethod) =>
    set({ collectionMethod: collectionMethod }),
  additionalServices: [],
  slots: {
    blood: null,
    cancer: null,
    microbiome: null,
    toxin: null,
  },
  addAdditionalService: (additionalService) =>
    set((state) => ({
      additionalServices: [...state.additionalServices, additionalService],
    })),
  removeAdditionalService: (id) =>
    set((state) => ({
      additionalServices: state.additionalServices.filter(
        (service) => service.id !== id,
      ),
    })),
  updateBloodSlot: (slot) =>
    set((state) => ({
      slots: { ...state.slots, blood: slot },
    })),
  updateCancerSlot: (slot) =>
    set((state) => ({
      slots: { ...state.slots, cancer: slot },
    })),
  updateMicrobiomeAddress: (address) =>
    set((state) => ({
      slots: { ...state.slots, microbiome: address },
    })),
  updateToxinAddress: (address) =>
    set((state) => ({
      slots: { ...state.slots, toxin: address },
    })),
  orderTotal: 49900, // base membership price always checked
  increaseOrderTotal: (amount: number) =>
    set((state) => ({
      orderTotal: state.orderTotal + amount,
    })),
  decreaseOrderTotal: (amount: number) =>
    set((state) => ({
      orderTotal: state.orderTotal - amount,
    })),
}));
