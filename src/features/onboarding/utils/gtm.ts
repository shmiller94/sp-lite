import { RewardfulWindow } from '@/types/window';
import { getAccessCode } from '@/utils/access-code';

export const trackSubscription = (price: number | undefined) => {
  try {
    // We'll handle this server-side, keeping only GTM for now
    const win = window as RewardfulWindow;
    const accessCode = getAccessCode();

    if (win.dataLayer) {
      win.dataLayer.push({
        event: 'subscription',
        value: price ?? 49900,
        referralId: win.Rewardful?.referral || null,
        rewardfulCode: win.Rewardful?.coupon || null,
        accessCode: accessCode || null,
      });
    }
  } catch (error) {
    console.error('GTM tracking failed:', error);
  }
};
