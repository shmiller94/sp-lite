import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RegisterLayout } from '@/components/layouts/register-layout';
import { env } from '@/config/env';
import { CouponCodeAccessForm } from '@/features/auth/components/coupon-code-access-form';
import { RegisterForm } from '@/features/auth/components/register';
import { updateAccessCode } from '@/utils/access-code';

export const RegisterRoute = () => {
  const navigate = useNavigate();

  const [couponValidated, setCouponValidated] = useState(!env.ENABLE_WAITLIST);

  // Save Rewardful coupon to localStorage as soon as the registration page loads
  useEffect(() => {
    const rewardfulCoupon = (window as any)?.Rewardful?.coupon?.id;
    if (rewardfulCoupon) {
      updateAccessCode(rewardfulCoupon);
    }
  }, []);

  return (
    <RegisterLayout>
      {couponValidated ? (
        <RegisterForm
          onSuccess={() =>
            navigate('/onboarding', {
              replace: true,
            })
          }
        />
      ) : (
        <CouponCodeAccessForm codeValidated={() => setCouponValidated(true)} />
      )}
    </RegisterLayout>
  );
};
