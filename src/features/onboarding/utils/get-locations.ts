import {
  DEFAULT_LOCATIONS,
  SPECIAL_LOCATIONS,
} from '@/features/onboarding/const/locations';
import { EVENT_SPECIAL_CODE } from '@/features/onboarding/const/special-code';

export const getLocations = () => {
  const accessCode = localStorage.getItem('superpower-code');

  switch (accessCode) {
    case EVENT_SPECIAL_CODE:
      return SPECIAL_LOCATIONS;
    default:
      return DEFAULT_LOCATIONS;
  }
};
