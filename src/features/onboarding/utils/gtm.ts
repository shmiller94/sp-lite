import { SubscriptionPrice } from '@/types/api';
import { RewardfulWindow } from '@/types/window';

export const trackSubscription = (price: SubscriptionPrice | undefined) => {
  try {
    const win = window as RewardfulWindow;
    const accessCode = localStorage.getItem('superpower-code');

    if (win.dataLayer) {
      win.dataLayer.push({
        event: 'subscription',
        value: price?.total ?? 49900,
        referralId: win.Rewardful?.referral || null,
        rewardfulCode: win.Rewardful?.coupon || null,
        accessCode: accessCode || null,
      });
    }
  } catch (error) {
    console.error('GTM tracking failed:', error);
  }
};
