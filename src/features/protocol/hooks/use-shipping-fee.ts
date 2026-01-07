import { useMemo } from 'react';

const THRESHOLD_CENTS = 15000;
const FEE_CENTS = 1000;

export const useShippingFee = (subtotalCents: number) => {
  return useMemo(() => {
    const shippingCents =
      subtotalCents >= THRESHOLD_CENTS || subtotalCents === 0 ? 0 : FEE_CENTS;
    const totalWithShipping = subtotalCents + shippingCents;
    const isFree = shippingCents === 0;

    return {
      shippingCents,
      totalWithShipping,
      thresholdCents: THRESHOLD_CENTS,
      feeCents: FEE_CENTS,
      isFree,
    };
  }, [subtotalCents]);
};
