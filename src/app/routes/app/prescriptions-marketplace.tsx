import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { PRESCRIPTIONS_MARKETPLACE_URL } from '@/const/marketplaces';
import { useUser } from '@/lib/auth';

export const PrescriptionsMarketplaceRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useUser();

  useEffect(() => {
    window.open(PRESCRIPTIONS_MARKETPLACE_URL, '_blank', 'noopener,noreferrer');
    // Redirect back to previous route or root if came directly to /prescriptions
    const previousPath = location.state?.from || '/';
    navigate(previousPath, { replace: true });
  }, [user, navigate, location.state]);

  return null;
};
