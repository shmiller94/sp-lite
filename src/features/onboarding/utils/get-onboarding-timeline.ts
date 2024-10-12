import { CollectionMethodType } from '@/types/api';
import { TimelineType } from '@/types/timeline';

/**
 * Returns events timeline based on collection method
 * @param collectionMethod
 */
export const getOnboardingTimeline = (
  collectionMethod: CollectionMethodType | null,
): TimelineType[] => {
  switch (collectionMethod) {
    case 'AT_HOME':
    case 'PHLEBOTOMY_KIT':
      return [
        { title: 'Membership confirmed', complete: true },
        {
          title: 'Schedule your appointment',
          complete: true,
        },
        {
          title: 'At-home visit',
          complete: false,
        },
        { title: 'Test results processed within 10 days', complete: false },
        { title: 'Results uploaded', complete: false },
        { title: 'Schedule a follow-up appointment', complete: false },
      ];
    case 'EVENT':
      return [
        { title: 'Membership confirmed', complete: true },
        {
          title: 'Schedule your appointment',
          complete: true,
        },
        {
          title: 'Event - Superpower',
          complete: false,
        },
        { title: 'Test results processed within 10 days', complete: false },
        { title: 'Results uploaded', complete: false },
        { title: 'Schedule a follow-up appointment', complete: false },
      ];
    default:
      return [
        { title: 'Membership confirmed', complete: true },
        {
          title: 'Schedule your appointment',
          complete: true,
        },
        {
          title: 'In-person lab',
          complete: false,
        },
        { title: 'Test results processed within 10 days', complete: false },
        { title: 'Results uploaded', complete: false },
        { title: 'Schedule a follow-up appointment', complete: false },
      ];
  }
};
