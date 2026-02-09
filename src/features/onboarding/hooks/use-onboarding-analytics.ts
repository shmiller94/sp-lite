import { useCallback } from 'react';

import { useAnalytics } from '@/hooks/use-analytics';

type CreditPurchase = {
  id: string;
  price: number;
};

type TrackOnboardingCreditPurchaseParams = {
  credits: CreditPurchase[];
  totalValue: number;
  paymentProvider: string;
};

export const useOnboardingAnalytics = () => {
  const { track } = useAnalytics();

  const trackOnboardingCreditPurchase = useCallback(
    ({
      credits,
      totalValue,
      paymentProvider,
    }: TrackOnboardingCreditPurchaseParams): void => {
      // Non blocking fire-and-forget
      void Promise.resolve(
        track('onboarding_credits_purchased', {
          credits,
          totalValue,
          value: totalValue,
          payment_provider: paymentProvider.toLowerCase(),
        }),
      ).catch((error) => {
        console.error('Failed to track onboarding credit purchase:', error);
      });
    },
    [track],
  );

  return {
    trackOnboardingCreditPurchase,
  };
};
