import { useUser } from '@/lib/auth';
import { ConsentType } from '@/types/api';

import { useGetConsent } from '../api';

export const useNeedsPhiMarketingConsent = () => {
  const { data: user } = useUser();
  const { data, isLoading } = useGetConsent({
    userId: user?.id || '',
    type: ConsentType.PHI_MARKETING,
  });

  const shouldShow = !isLoading && data?.exists === false;
  return { needsConsent: shouldShow, isLoading };
};
