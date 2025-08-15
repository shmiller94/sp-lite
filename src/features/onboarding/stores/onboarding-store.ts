import { create } from 'zustand';

import { AvailableSubscription } from '@/types/api';
import { getAccessCode, setManualCouponOverride } from '@/utils/access-code';

type OnboardingStore = {
  membership: AvailableSubscription | null;
  updateMembership: (membershipType: AvailableSubscription | null) => void;
  consentGiven: boolean;
  setConsentGiven: (consentGiven: boolean) => void;
  processing: boolean;
  setProcessing: (processing: boolean) => void;
  showAccessCode: boolean;
  setShowAccessCode: (show: boolean) => void;
  coupon: string | null;
  setCoupon: (coupon: string | null) => void;
};

export const useOnboarding = create<OnboardingStore>()((set) => ({
  membership: null,
  updateMembership: (membership) => {
    console.warn(`Updated membership to ${JSON.stringify(membership)}`);
    set({ membership });
  },
  consentGiven: false,
  setConsentGiven: (consentGiven) => set({ consentGiven }),
  processing: false,
  setProcessing: (processing) => set({ processing }),
  showAccessCode: false,
  setShowAccessCode: (show) => set({ showAccessCode: show }),
  coupon: getAccessCode(),
  setCoupon: (coupon) => {
    set({ coupon });
    if (coupon) {
      // set manual coupon override to be accessible in all getAccessCode() calls
      // this would save it into sessionstorage
      setManualCouponOverride(coupon);
    }
  },
}));
