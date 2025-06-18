export const updateAccessCode = (accessCode: string) => {
  localStorage.setItem('superpower-code', accessCode.trim());
};

// Store manual coupon override in sessionStorage
export const setManualCouponOverride = (accessCode: string) => {
  const override = {
    code: accessCode.trim(),
    timestamp: Date.now(),
  };
  sessionStorage.setItem('superpower-manual-coupon', JSON.stringify(override));
};

// Clear manual coupon override
export const clearManualCouponOverride = () => {
  sessionStorage.removeItem('superpower-manual-coupon');
};

// Get manual coupon override from sessionStorage
const getManualCouponOverride = () => {
  try {
    const stored = sessionStorage.getItem('superpower-manual-coupon');
    if (stored) {
      const override = JSON.parse(stored);
      return override.code;
    }
  } catch (error) {
    // Invalid JSON, clear it
    clearManualCouponOverride();
  }
  return null;
};

export const getAccessCode = () => {
  // First check for manual override in sessionStorage
  const manualOverride = getManualCouponOverride();
  if (manualOverride && manualOverride !== '$') {
    return manualOverride;
  }

  // Then check for Rewardful coupon in window object
  const rewardfulCoupon = (window as any)?.Rewardful?.coupon?.id;
  if (rewardfulCoupon && rewardfulCoupon.trim() !== '$') {
    return rewardfulCoupon.trim();
  }

  // Fall back to localStorage
  const localCode = localStorage.getItem('superpower-code')?.trim();
  if (localCode && localCode !== '$') {
    return localCode;
  }

  return null;
};
