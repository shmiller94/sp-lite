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

type TrackOnboardingCreditAddedToCartParams = {
  id: string;
  price: number;
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

  const trackOnboardingCreditAddedToCart = useCallback(
    ({ id, price }: TrackOnboardingCreditAddedToCartParams): void => {
      // Non blocking fire-and-forget
      void Promise.resolve(
        track('onboarding_credits_added_to_cart', {
          credit_id: id,
          credit_price: price,
          value: price,
        }),
      ).catch((error) => {
        console.error('Failed to track onboarding credit add to cart:', error);
      });
    },
    [track],
  );

  return {
    trackOnboardingCreditPurchase,
    trackOnboardingCreditAddedToCart,
  };
};
