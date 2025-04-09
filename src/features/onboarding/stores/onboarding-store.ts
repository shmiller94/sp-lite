import { create } from 'zustand';

import { SubscriptionType } from '@/types/api';

type OnboardingStore = {
  isZipBlocked: boolean;
  setIsZipBlocked: (isZipBlocked: boolean) => void;
  zipBlockedReason: 'state-not-serviceable' | 'no-providers-in-range' | '';
  setZipBlockedReason: (
    zipBlockedReason: 'state-not-serviceable' | 'no-providers-in-range' | '',
  ) => void;
  processing: boolean;
  setProcessing: (processing: boolean) => void;
  consentGiven: boolean;
  setConsentGiven: (consentGiven: boolean) => void;
  membershipType: SubscriptionType;
  updateMembershipType: (membershipType: SubscriptionType) => void;
};

export const useOnboarding = create<OnboardingStore>()((set) => ({
  isZipBlocked: false,
  setIsZipBlocked: (isZipBlocked) => set({ isZipBlocked }),
  zipBlockedReason: '',
  setZipBlockedReason: (zipBlockedReason) => set({ zipBlockedReason }),
  processing: false,
  setProcessing: (processing) => set({ processing }),
  consentGiven: false,
  setConsentGiven: (consentGiven) => set({ consentGiven }),
  membershipType: 'baseline',
  updateMembershipType: (membershipType) => set({ membershipType }),
}));
