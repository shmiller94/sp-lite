import moment from 'moment';

import { useLatestCompletedPlan } from '@/features/protocol/hooks/use-latest-completed-plan';

export const AIAP_PUBLISH_CUTOFF_DATE = moment('2025-09-01');

export const useNeedsCarePlanAnnouncement = () => {
  const {
    data: latestPlan,
    isLoading: isPlanLoading,
    lastViewed,
  } = useLatestCompletedPlan();

  const startDate = latestPlan?.period?.start;

  const isLegacyOrMissing =
    !latestPlan ||
    !startDate ||
    moment(startDate).isBefore(AIAP_PUBLISH_CUTOFF_DATE);

  if (isPlanLoading) return { needsAnnouncement: false, isLoading: true };
  if (isLegacyOrMissing) return { needsAnnouncement: false, isLoading: false };
  if (lastViewed) return { needsAnnouncement: false, isLoading: false };

  return {
    needsAnnouncement: !lastViewed,
    isLoading: false,
  };
};
