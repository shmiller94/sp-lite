import { useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';

import { getPartnerData } from './dub';

const MANUAL_COUPON_STORAGE_KEY = 'superpower-manual-coupon';

// Store manual coupon override in sessionStorage
export const setManualCouponOverride = (
  accessCode: string,
  metadata?: Record<string, string>,
) => {
  let finalMetadata = metadata;
  if (!metadata) {
    try {
      const existing = sessionStorage.getItem(MANUAL_COUPON_STORAGE_KEY);
      if (existing) {
        const parsed = JSON.parse(existing);
        if (parsed.metadata) {
          finalMetadata = parsed.metadata;
        }
      }
    } catch (error) {
      console.warn('Failed to parse existing coupon metadata:', error);
    }
  }

  const override = {
    code: accessCode.trim(),
    timestamp: Date.now(),
    metadata: finalMetadata,
  };
  try {
    sessionStorage.setItem(MANUAL_COUPON_STORAGE_KEY, JSON.stringify(override));
  } catch (error) {
    console.warn('Failed to store manual coupon override:', error);
  }
};

// Clear manual coupon override
export const clearManualCouponOverride = () => {
  try {
    sessionStorage.removeItem(MANUAL_COUPON_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear manual coupon override:', error);
  }
};

// Get manual coupon override from sessionStorage
const getManualCouponOverride = () => {
  try {
    const stored = sessionStorage.getItem(MANUAL_COUPON_STORAGE_KEY);
    if (stored) {
      const override = JSON.parse(stored);
      return override.code;
    }
  } catch (_error) {
    // Invalid JSON, clear it
    clearManualCouponOverride();
  }
  return null;
};

/**
 * 1. Check sessionStorage for a manually set coupon code
 * 2. Check for a Dub.co partner coupon code in cookies
 *
 * For URL coupon codes (`?code=`), use `useAccessCode()` which hydrates
 * sessionStorage so this function can remain hook-free.
 * @returns The coupon or null if none found
 */
export const getAccessCode = (): string | null => {
  // 1. Check sessionStorage for manually set coupon code
  const manualOverride = getManualCouponOverride();
  if (manualOverride && manualOverride !== '$') {
    console.warn(`Manual override coupon ${manualOverride} used`);
    return manualOverride;
  }

  // 2. Get dub.co partner coupon if exists
  const dubCookie = getPartnerData();
  if (dubCookie?.discount?.couponId && import.meta.env.PROD) {
    console.log(`coupon ${dubCookie.discount.couponId} used`);
    return dubCookie.discount.couponId;
  } else if (dubCookie?.discount?.couponTestId && !import.meta.env.PROD) {
    console.log(`test coupon ${dubCookie.discount.couponTestId} used`);
    return dubCookie.discount.couponTestId;
  }

  return null;
};

export const useUrlAccessCode = () => {
  const urlCode = useSearch({ strict: false, select: (s) => s.code });

  const urlCodeValue = urlCode?.trim();
  const urlCodeIsValid =
    urlCodeValue != null && urlCodeValue.length > 0 && urlCodeValue !== '$';

  return urlCodeIsValid ? urlCodeValue : null;
};

export const useAccessCode = () => {
  const urlCodeValue = useUrlAccessCode();

  useEffect(() => {
    if (urlCodeValue == null) return;

    console.warn(`URL coupon ${urlCodeValue} used`);
    setManualCouponOverride(urlCodeValue);
  }, [urlCodeValue]);

  if (urlCodeValue != null) return urlCodeValue;

  return getAccessCode();
};

// Get coupon metadata from session storage
export const getCouponMetadata = (): Record<string, string> | null => {
  try {
    const stored = sessionStorage.getItem(MANUAL_COUPON_STORAGE_KEY);
    if (stored) {
      const override = JSON.parse(stored);
      return override.metadata || null;
    }
  } catch (_error) {
    clearManualCouponOverride();
  }
  return null;
};
