import { isBefore } from 'date-fns';

import { useLatestCompletedPlan } from '@/features/protocol/hooks/use-latest-completed-plan';

export const AIAP_PUBLISH_CUTOFF_DATE = new Date('2025-09-01T00:00:00.000Z');

export const useNeedsCarePlanAnnouncement = () => {
  const {
    data: latestPlan,
    isLoading: isPlanLoading,
    lastViewed,
  } = useLatestCompletedPlan();

  const startDate = latestPlan?.period?.start;

  let isBeforeCutoff = false;
  if (startDate != null) {
    const start = new Date(startDate);
    isBeforeCutoff =
      Number.isNaN(start.getTime()) ||
      isBefore(start, AIAP_PUBLISH_CUTOFF_DATE);
  }

  const isLegacyOrMissing = !latestPlan || !startDate || isBeforeCutoff;

  if (isPlanLoading) return { needsAnnouncement: false, isLoading: true };
  if (isLegacyOrMissing) return { needsAnnouncement: false, isLoading: false };
  if (lastViewed) return { needsAnnouncement: false, isLoading: false };

  return {
    needsAnnouncement: !lastViewed,
    isLoading: false,
  };
};
