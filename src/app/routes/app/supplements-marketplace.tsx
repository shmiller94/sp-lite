import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { SUPPLEMENTS_MARKETPLACE_URL } from '@/const/marketplaces';
import { useGetMultipassUrl } from '@/features/shop/api/get-multipass-url';
import { useUser } from '@/lib/auth';

export const SupplementsMarketplaceRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useUser();
  const { data: multipassData, isLoading } = useGetMultipassUrl();

  useEffect(() => {
    // If user is signed in and multipass URL is available, redirect to the multipass URL
    if (multipassData?.url) {
      // Open supplements marketplace in a new tab
      window.open(multipassData.url, '_blank', 'noopener,noreferrer');
      // Redirect back to previous route or root if came directly to /supplements
      const previousPath = location.state?.from || '/';
      navigate(previousPath, { replace: true });
    } else if (!isLoading) {
      // If multipass URL is not available (and not loading), fallback to the default supplements marketplace URL
      window.open(SUPPLEMENTS_MARKETPLACE_URL, '_blank', 'noopener,noreferrer');
      // Redirect back to previous route or root if came directly to /supplements
      const previousPath = location.state?.from || '/';
      navigate(previousPath, { replace: true });
    }
  }, [user, navigate, multipassData, isLoading, location.state]);

  return null;
};
