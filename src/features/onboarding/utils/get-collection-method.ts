import { EVENT_SPECIAL_CODE } from '@/features/onboarding/const/special-code';
import { CollectionMethodType } from '@/types/api';

export const getOnboardingCollectionMethod = (): CollectionMethodType => {
  const accessCode = localStorage.getItem('superpower-code');

  switch (accessCode) {
    case EVENT_SPECIAL_CODE:
      return 'EVENT';
    default:
      return 'IN_LAB';
  }
};
