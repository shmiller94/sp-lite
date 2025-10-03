import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  PRESCRIPTIONS_MARKETPLACE_URL_PROD,
  PRESCRIPTIONS_MARKETPLACE_URL_STAGING,
} from '@/const/marketplaces';
import { useAnalytics } from '@/hooks/use-analytics';
import { useUser } from '@/lib/auth';
import { isMobile } from '@/utils/browser-detection';

const PRESCRIPTIONS_MARKETPLACE_URL =
  process.env.NODE_ENV === 'production'
    ? PRESCRIPTIONS_MARKETPLACE_URL_PROD
    : PRESCRIPTIONS_MARKETPLACE_URL_STAGING;

export const PrescriptionsMarketplaceRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useUser();
  const { track } = useAnalytics();

  // Detect if user is on mobile
  const isMobileDevice = isMobile();

  useEffect(() => {
    track('click_prescriptions_marketplace');
    if (isMobileDevice) {
      // On mobile, redirect directly to the URL instead of opening in new tab
      window.location.href = PRESCRIPTIONS_MARKETPLACE_URL;
    } else {
      // On desktop, open prescriptions marketplace in a new tab
      window.open(
        PRESCRIPTIONS_MARKETPLACE_URL,
        '_blank',
        'noopener,noreferrer',
      );
      // Redirect back to previous route or root if came directly to /prescriptions
      const previousPath = location.state?.from || '/';
      navigate(previousPath, { replace: true });
    }
  }, [user, navigate, location.state, isMobileDevice, track]);

  return null;
};
