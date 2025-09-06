import { create } from 'zustand';

import { AvailableSubscription } from '@/types/api';
import { getAccessCode, setManualCouponOverride } from '@/utils/access-code';

type CheckoutStore = {
  membership: AvailableSubscription | null;
  updateMembership: (membershipType: AvailableSubscription | null) => void;
  processing: boolean;
  setProcessing: (processing: boolean) => void;
  showCoupon: boolean;
  setShowCoupon: (show: boolean) => void;
  coupon: string | null;
  setCoupon: (coupon: string | null) => void;
};

export const useCheckoutContext = create<CheckoutStore>()((set) => ({
  membership: null,
  updateMembership: (membership) => {
    console.warn(`Updated membership to ${JSON.stringify(membership)}`);
    set({ membership });
  },
  processing: false,
  setProcessing: (processing) => set({ processing }),
  showCoupon: false,
  setShowCoupon: (showCoupon) => set({ showCoupon }),
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
