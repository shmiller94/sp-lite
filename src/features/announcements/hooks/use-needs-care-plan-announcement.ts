import moment from 'moment';

import {
  AIAP_PUBLISH_CUTOFF_DATE,
  getLocalStorageViewed,
} from '@/features/announcements/utils/care-plan';
import { useCheckActionPlanViewed } from '@/features/plans/api';
import { useLatestCompletedPlan } from '@/features/plans/hooks/use-latest-completed-plan';

export const useNeedsCarePlanAnnouncement = () => {
  const { data: latestPlan, isLoading: isPlanLoading } =
    useLatestCompletedPlan();

  const startDate = latestPlan?.period?.start;

  const isLegacyOrMissing =
    !latestPlan ||
    !startDate ||
    moment(startDate).isBefore(AIAP_PUBLISH_CUTOFF_DATE);

  const localViewed = latestPlan?.id
    ? getLocalStorageViewed(latestPlan.id)
    : null;

  const shouldCheckBackend = !!(
    latestPlan?.id &&
    !isLegacyOrMissing &&
    !localViewed
  );

  const viewStatusQuery = useCheckActionPlanViewed({
    planId: latestPlan?.id ?? '',
    queryConfig: { enabled: shouldCheckBackend },
  });

  const isLoading =
    isPlanLoading || (shouldCheckBackend && viewStatusQuery.isLoading);

  if (isLoading) return { needsAnnouncement: false, isLoading: true };
  if (isLegacyOrMissing) return { needsAnnouncement: false, isLoading: false };
  if (localViewed) return { needsAnnouncement: false, isLoading: false };

  return {
    needsAnnouncement: shouldCheckBackend
      ? !viewStatusQuery.data?.hasBeenViewed
      : false,
    isLoading: false,
  };
};
