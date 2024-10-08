import { OnboardingLocation } from '@/features/onboarding/types/location';

export const DEFAULT_LOCATIONS: OnboardingLocation[] = [
  {
    displayName: 'In-person lab',
    description: 'Get testing at a partner clinic.',
    price: 0,
    type: 'IN_LAB',
  },
  {
    displayName: 'At-home visit',
    description: 'Stress-free at your home or office.',
    price: 7900,
    type: 'AT_HOME',
  },
];

export const SPECIAL_LOCATIONS: OnboardingLocation[] = [
  {
    displayName: 'Event',
    description: 'In-person Superpower Event',
    price: 0,
    type: 'EVENT',
  },
];
